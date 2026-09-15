import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useReducer,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useId,
  useTransition,
  useDeferredValue,
  useActionState,
  useOptimistic,
} from 'react'
import { useFormStatus } from 'react-dom'

// 1. useState
function UseStateShowcase() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React Hooks', done: true },
    { id: 2, text: 'Understand useState', done: false },
  ])
  const [inputText, setInputText] = useState('')

  function addTodo() {
    if (!inputText.trim()) return
    setTodos([...todos, { id: Date.now(), text: inputText, done: false }])
    setInputText('')
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <div>
      <h2>1. useState</h2>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Add task..."
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {todo.text}
            </span>
            {' '}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 2. useEffect
const FAKE_USERS = {
  1: { name: 'aryan', role: 'Frontend Developer', email: 'aryan@example.com' },
  2: { name: 'abhay', role: 'Backend Engineer', email: 'abhay@example.com' },
  3: { name: 'abhi', role: 'UI Designer', email: 'abhi@example.com' },
}

function UseEffectShowcase() {
  const [selectedId, setSelectedId] = useState('1')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setUserData(null)

    const timer = setTimeout(() => {
      setUserData(FAKE_USERS[selectedId])
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedId])

  return (
    <div>
      <h2>2. useEffect</h2>
      <label>User: </label>
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
      </select>

      {loading && <p>Loading...</p>}
      {userData && (
        <p>
          {userData.name} | {userData.role} | {userData.email}
        </p>
      )}
    </div>
  )
}

// 3. useLayoutEffect
function UseLayoutEffectShowcase() {
  const [text, setText] = useState('Short')
  const [left, setLeft] = useState(0)
  const [show, setShow] = useState(false)

  const buttonRef = useRef(null)
  const tooltipRef = useRef(null)

  useLayoutEffect(() => {
    if (show && buttonRef.current && tooltipRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect()
      const tipRect = tooltipRef.current.getBoundingClientRect()
      setLeft(btnRect.left + btnRect.width / 2 - tipRect.width / 2)
    }
  }, [show, text])

  return (
    <div>
      <h2>3. useLayoutEffect</h2>
      <button ref={buttonRef} onClick={() => setShow(!show)}>
        {show ? 'Hide Tooltip' : 'Show Tooltip'}
      </button>
      <button onClick={() => setText(text === 'Short' ? 'Longer Tooltip Content' : 'Short')}>
        Change Text
      </button>

      {show && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: `${left}px`,
            border: '1px solid black',
            padding: '4px',
            background: 'white',
          }}
        >
          {text}
        </div>
      )}
    </div>
  )
}

// 4. useRef
function UseRefShowcase() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerIdRef = useRef(null)

  const inputRef = useRef(null)

  const [text, setText] = useState('Apple')
  const prevTextRef = useRef('')

  useEffect(() => {
    prevTextRef.current = text
  }, [text])

  function start() {
    if (timerIdRef.current) return
    setIsRunning(true)
    timerIdRef.current = setInterval(() => {
      setTime((t) => t + 1)
    }, 100)
  }

  function stop() {
    clearInterval(timerIdRef.current)
    timerIdRef.current = null
    setIsRunning(false)
  }

  function reset() {
    stop()
    setTime(0)
  }

  return (
    <div>
      <h2>4. useRef</h2>
      <p>Stopwatch: {(time / 10).toFixed(1)}s</p>
      <button onClick={start} disabled={isRunning}>Start</button>
      <button onClick={stop} disabled={!isRunning}>Stop</button>
      <button onClick={reset}>Reset</button>

      <br /><br />
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => inputRef.current.focus()}>Focus Input</button>
      <p>Current: {text} | Previous: {prevTextRef.current}</p>
    </div>
  )
}

// 5. useReducer
const initialCart = [
  { id: 1, name: 'Headphones', price: 99, qty: 1 },
  { id: 2, name: 'Cable', price: 15, qty: 2 },
]

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, { id: Date.now(), name: action.name, price: action.price, qty: 1 }]
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.id)
    case 'CHANGE_QTY':
      return state.map((item) =>
        item.id === action.id ? { ...item, qty: Math.max(1, item.qty + action.amount) } : item
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

function UseReducerShowcase() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div>
      <h2>5. useReducer</h2>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', name: 'Mouse', price: 45 })}>
        + Add Mouse ($45)
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>

      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.qty} = ${item.price * item.qty}{' '}
            <button onClick={() => dispatch({ type: 'CHANGE_QTY', id: item.id, amount: 1 })}>+</button>
            <button onClick={() => dispatch({ type: 'CHANGE_QTY', id: item.id, amount: -1 })}>-</button>
            <button onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}>Delete</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
    </div>
  )
}

// 6. useMemo
function heavyCalculation(num) {
  const start = performance.now()
  let sum = 0
  for (let i = 0; i < 35000000; i++) {
    sum += (i % 5)
  }
  const time = (performance.now() - start).toFixed(2)
  return { result: sum + num, time }
}

function UseMemoShowcase() {
  const [num, setNum] = useState(10)
  const [unrelated, setUnrelated] = useState(0)
  const [useMemoEnabled, setUseMemoEnabled] = useState(true)

  const memoized = useMemo(() => {
    return heavyCalculation(num)
  }, [num])

  const calc = useMemoEnabled ? memoized : heavyCalculation(num)

  return (
    <div>
      <h2>6. useMemo</h2>
      <label>
        <input
          type="checkbox"
          checked={useMemoEnabled}
          onChange={(e) => setUseMemoEnabled(e.target.checked)}
        />
        Enable useMemo
      </label>
      <p>Result: {calc.result} | Calculation time: {calc.time} ms</p>
      <button onClick={() => setNum(num + 1)}>Change Number ({num})</button>
      <button onClick={() => setUnrelated(unrelated + 1)}>Unrelated Re-render ({unrelated})</button>
    </div>
  )
}

// 7. useCallback
const ChildButton = React.memo(function ChildButton({ onClick, text }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div>
      <button onClick={onClick}>{text}</button>
      <span> (Child Renders: {renders.current})</span>
    </div>
  )
})

function UseCallbackShowcase() {
  const [input, setInput] = useState('')
  const [useCallbackEnabled, setUseCallbackEnabled] = useState(true)

  const stableCallback = useCallback(() => {
    alert('Clicked!')
  }, [])

  const unstableCallback = () => {
    alert('Clicked!')
  }

  const activeCallback = useCallbackEnabled ? stableCallback : unstableCallback

  return (
    <div>
      <h2>7. useCallback</h2>
      <label>
        <input
          type="checkbox"
          checked={useCallbackEnabled}
          onChange={(e) => setUseCallbackEnabled(e.target.checked)}
        />
        Enable useCallback
      </label>
      <br />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type to re-render parent..."
      />
      <ChildButton onClick={activeCallback} text="Click Child Button" />
    </div>
  )
}

// 8. useImperativeHandle
const ChildPlayer = forwardRef((props, ref) => {
  const [status, setStatus] = useState('Stopped')
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      if (timerRef.current) return
      setStatus('Playing')
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    },
    pause: () => {
      clearInterval(timerRef.current)
      timerRef.current = null
      setStatus('Paused')
    },
    reset: () => {
      clearInterval(timerRef.current)
      timerRef.current = null
      setStatus('Stopped')
      setSeconds(0)
    },
  }))

  return (
    <p>Player Status: {status} ({seconds}s)</p>
  )
})

function UseImperativeHandleShowcase() {
  const playerRef = useRef(null)

  return (
    <div>
      <h2>8. useImperativeHandle</h2>
      <ChildPlayer ref={playerRef} />
      <button onClick={() => playerRef.current.play()}>Play</button>
      <button onClick={() => playerRef.current.pause()}>Pause</button>
      <button onClick={() => playerRef.current.reset()}>Reset</button>
    </div>
  )
}

// 9. useId
function Field({ label }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>{label}: </label>
      <input id={id} />
      <span> (id: {id})</span>
    </div>
  )
}

function UseIdShowcase() {
  return (
    <div>
      <h2>9. useId</h2>
      <Field label="Billing Email" />
      <Field label="Shipping Email" />
    </div>
  )
}

// 10. useTransition
const BIG_LIST = Array.from({ length: 6000 }, (_, i) => `Item #${i + 1}`)

function UseTransitionShowcase() {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(BIG_LIST)
  const [isPending, startTransition] = useTransition()

  function handleSearch(e) {
    const val = e.target.value
    setSearch(val)
    startTransition(() => {
      setFiltered(BIG_LIST.filter((item) => item.includes(val)))
    })
  }

  return (
    <div>
      <h2>10. useTransition</h2>
      <input value={search} onChange={handleSearch} placeholder="Type number..." />
      {isPending && <span> (Filtering 6,000 items in background...)</span>}
      <p>Count: {filtered.length}</p>
      <ul>
        {filtered.slice(0, 5).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

// 11. useDeferredValue
function UseDeferredValueShowcase() {
  const [text, setText] = useState('')
  const deferredText = useDeferredValue(text)

  return (
    <div>
      <h2>11. useDeferredValue</h2>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." />
      <p>Immediate: {text}</p>
      <p>Deferred: {deferredText}</p>
    </div>
  )
}

// 12. useActionState (React 19)
async function submitAction(prevState, formData) {
  const email = formData.get('email')
  await new Promise((res) => setTimeout(res, 1000))
  if (!email || !email.includes('@')) {
    return { error: 'Invalid email' }
  }
  return { success: 'Saved ' + email }
}

function UseActionStateShowcase() {
  const [state, formAction, isPending] = useActionState(submitAction, null)

  return (
    <div>
      <h2>12. useActionState (React 19)</h2>
      <form action={formAction}>
        <input name="email" placeholder="Email" />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {state?.error && <p>{state.error}</p>}
      {state?.success && <p>{state.success}</p>}
    </div>
  )
}

// 13. useFormStatus (React 19)
function FormSubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Submit'}
    </button>
  )
}

function UseFormStatusShowcase() {
  async function action(formData) {
    await new Promise((res) => setTimeout(res, 1000))
    alert('Submitted: ' + formData.get('title'))
  }

  return (
    <div>
      <h2>13. useFormStatus (React 19)</h2>
      <form action={action}>
        <input name="title" defaultValue="Document" />
        <FormSubmitBtn />
      </form>
    </div>
  )
}

// 14. useOptimistic (React 19)
function UseOptimisticShowcase() {
  const [likes, setLikes] = useState(10)
  const [simulateError, setSimulateError] = useState(false)
  const [status, setStatus] = useState('Idle')

  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    likes,
    (current, amount) => current + amount
  )

  function handleLike() {
    setStatus('Sending...')
    React.startTransition(async () => {
      setOptimisticLikes(1)
      await new Promise((res) => setTimeout(res, 1500))

      if (simulateError) {
        setStatus('Error: rolled back')
        return
      }

      setLikes((l) => l + 1)
      setStatus('Saved')
    })
  }

  return (
    <div>
      <h2>14. useOptimistic (React 19)</h2>
      <p>Likes: {optimisticLikes} ({status})</p>
      <button onClick={handleLike}>Like (+1)</button>
      <label>
        <input
          type="checkbox"
          checked={simulateError}
          onChange={(e) => setSimulateError(e.target.checked)}
        />
        Simulate Error
      </label>
    </div>
  )
}

// 15. Custom Hook (useLocalStorage)
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  }, [key, value])

  return [value, setValue]
}

function CustomHookShowcase() {
  const [note, setNote] = useLocalStorage('note', 'Persistent text')

  return (
    <div>
      <h2>15. Custom Hook (useLocalStorage)</h2>
      <input value={note} onChange={(e) => setNote(e.target.value)} />
      <p>Stored: {note}</p>
    </div>
  )
}

// Main App
export default function App() {
  return (
    <div>
      <h1>React Hooks</h1>
      <hr />
      <UseStateShowcase />
      <hr />
      <UseEffectShowcase />
      <hr />
      <UseLayoutEffectShowcase />
      <hr />
      <UseRefShowcase />
      <hr />
      <UseReducerShowcase />
      <hr />
      <UseMemoShowcase />
      <hr />
      <UseCallbackShowcase />
      <hr />
      <UseImperativeHandleShowcase />
      <hr />
      <UseIdShowcase />
      <hr />
      <UseTransitionShowcase />
      <hr />
      <UseDeferredValueShowcase />
      <hr />
      <UseActionStateShowcase />
      <hr />
      <UseFormStatusShowcase />
      <hr />
      <UseOptimisticShowcase />
      <hr />
      <CustomHookShowcase />
    </div>
  )
}
