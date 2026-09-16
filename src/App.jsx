import React, {
  forwardRef,
  useActionState,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
  useOptimistic,
} from 'react'
import { useFormStatus } from 'react-dom'

function UseStateExample() {
  const [count, setCount] = useState(0)
  return <section><h2>1. useState — remember a value</h2><p>Count: {count}</p><button onClick={() => setCount(count + 1)}>Add 1</button></section>
}

function UseEffectExample() {
  const [message, setMessage] = useState('Loading...')
  useEffect(() => {
    const timer = setTimeout(() => setMessage('Hello after 1 second!'), 1000)
    return () => clearTimeout(timer)
  }, [])
  return <section><h2>2. useEffect — do something after rendering</h2><p>{message}</p></section>
}

function UseLayoutEffectExample() {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => setWidth(boxRef.current.getBoundingClientRect().width), [])
  return <section><h2>3. useLayoutEffect — measure the screen</h2><div ref={boxRef} style={{ padding: 12, border: '1px solid currentColor' }}>This box is {Math.round(width)}px wide.</div></section>
}

function UseRefExample() {
  const inputRef = useRef(null)
  return <section><h2>4. useRef — access an element</h2><input ref={inputRef} placeholder="Click the button" /><button onClick={() => inputRef.current.focus()}>Focus input</button></section>
}

function UseReducerExample() {
  function reducer(count, action) {
    if (action.type === 'add') return count + 1
    if (action.type === 'subtract') return count - 1
    return count
  }
  const [count, dispatch] = useReducer(reducer, 0)
  return <section><h2>5. useReducer — update state with actions</h2><p>Count: {count}</p><button onClick={() => dispatch({ type: 'subtract' })}>-</button><button onClick={() => dispatch({ type: 'add' })}>+</button></section>
}

function UseMemoExample() {
  const [number, setNumber] = useState(2)
  const squared = useMemo(() => number * number, [number])
  return <section><h2>6. useMemo — remember a calculation</h2><button onClick={() => setNumber(number + 1)}>Number: {number}</button><p>Squared: {squared}</p></section>
}

const SmallButton = React.memo(function SmallButton({ onClick }) {
  return <button onClick={onClick}>Say hello</button>
})

function UseCallbackExample() {
  const [text, setText] = useState('')
  const sayHello = useCallback(() => alert('Hello!'), [])
  return <section><h2>7. useCallback — remember a function</h2><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type anything" /><SmallButton onClick={sayHello} /></section>
}

const Message = forwardRef(function Message(_, ref) {
  useImperativeHandle(ref, () => ({ show: () => alert('Hello from the child!') }))
  return <p>Child component</p>
})

function UseImperativeHandleExample() {
  const messageRef = useRef(null)
  return <section><h2>8. useImperativeHandle — call a child function</h2><Message ref={messageRef} /><button onClick={() => messageRef.current.show()}>Ask child to say hello</button></section>
}

function UseIdExample() {
  const emailId = useId()
  return <section><h2>9. useId — create a unique id</h2><label htmlFor={emailId}>Email: </label><input id={emailId} /></section>
}

function UseTransitionExample() {
  const [text, setText] = useState('')
  const [items, setItems] = useState([])
  const [isPending, startTransition] = useTransition()
  function search(e) {
    const value = e.target.value
    setText(value)
    startTransition(() => setItems(value ? [`Result for: ${value}`] : []))
  }
  return <section><h2>10. useTransition — mark an update as less urgent</h2><input value={text} onChange={search} placeholder="Search" />{isPending ? <p>Searching...</p> : <p>{items[0]}</p>}</section>
}

function UseDeferredValueExample() {
  const [text, setText] = useState('')
  const slowText = useDeferredValue(text)
  return <section><h2>11. useDeferredValue — show an older value for a moment</h2><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here" /><p>Typed now: {text}</p><p>Deferred: {slowText}</p></section>
}

async function saveName(previousState, formData) {
  const name = formData.get('name')
  if (!name) return { message: 'Please enter a name.' }
  return { message: `Saved ${name}!` }
}

function UseActionStateExample() {
  const [state, action, isPending] = useActionState(saveName, { message: '' })
  return <section><h2>12. useActionState — handle a form result</h2><form action={action}><input name="name" placeholder="Your name" /><button disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</button></form><p>{state.message}</p></section>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Sending...' : 'Send'}</button>
}

function UseFormStatusExample() {
  async function sendForm(formData) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(`Sent: ${formData.get('message')}`)
  }
  return <section><h2>13. useFormStatus — know if a form is submitting</h2><form action={sendForm}><input name="message" defaultValue="Hello" /><SubmitButton /></form></section>
}

function UseOptimisticExample() {
  const [likes, setLikes] = useState(0)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (value) => value + 1)
  function like() {
    React.startTransition(async () => {
      addOptimisticLike()
      await new Promise((resolve) => setTimeout(resolve, 800))
      setLikes((value) => value + 1)
    })
  }
  return <section><h2>14. useOptimistic — show the result before saving finishes</h2><p>Likes: {optimisticLikes}</p><button onClick={like}>Like</button></section>
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => localStorage.getItem(key) || initialValue)
  useEffect(() => localStorage.setItem(key, value), [key, value])
  return [value, setValue]
}

function CustomHookExample() {
  const [name, setName] = useLocalStorage('name', '')
  return <section><h2>15. Custom hook — reuse logic</h2><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /><p>Refresh the page: your name stays saved.</p></section>
}

export default function App() {
  return <main><h1>Simple React Hooks</h1><p>Each example shows one hook in a small way.</p><UseStateExample /><UseEffectExample /><UseLayoutEffectExample /><UseRefExample /><UseReducerExample /><UseMemoExample /><UseCallbackExample /><UseImperativeHandleExample /><UseIdExample /><UseTransitionExample /><UseDeferredValueExample /><UseActionStateExample /><UseFormStatusExample /><UseOptimisticExample /><CustomHookExample /></main>
}
