import { useEffect, useState } from 'react'

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

function App() {
  const [amount, setAmount] = useState(1)
  const [fromCur, setFromCur] = useState('EUR')
  const [toCur, setToCur] = useState('USD')
  const [converted, setConverted] = useState(0)
  const [date, setDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInput = (e) => {
    const value = Number(e.target.value)
    if (value < 0) {
      setError('Please enter a positive number')
      return
    }
    if (isNaN(value)) {
      setError('Please enter a valid number')
      return
    }
    if (value === 0) {
      setAmount(0)
      setError('Please enter a number greater than 0')
      return
    }
    setError('')
    setAmount(value)
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
      setLoading(true)
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await res.json()

        console.log('data:', data.rates[toCur])
        setConverted(data?.rates[toCur] || 0)
        setDate(data?.date || '')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message || 'Something went wrong')
        }
      } finally {
        setLoading(false)
      }
    }

    if (fromCur === toCur) {
      setConverted(amount)
      return
    }

    if (amount > 0 && fromCur !== toCur) {
      setError('')
      fetchData()
    }

    return () => {
      console.log('Cleaning up')
      controller.abort()
    }
  }, [amount, fromCur, toCur])

  return (
    <div>
      <input
        type='number'
        min={0}
        value={amount}
        onChange={handleInput}
        disabled={loading}
      />
      <select
        value={fromCur}
        onChange={(e) => setFromCur(e.target.value)}
        disabled={loading}
      >
        <option value='USD'>USD</option>
        <option value='EUR'>EUR</option>
        <option value='CAD'>CAD</option>
        <option value='INR'>INR</option>
      </select>
      <select
        value={toCur}
        onChange={(e) => setToCur(e.target.value)}
        disabled={loading}
      >
        <option value='USD'>USD</option>
        <option value='EUR'>EUR</option>
        <option value='CAD'>CAD</option>
        <option value='INR'>INR</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && (
        <>
          {date && (
            <p>
              Last updated: <em>{date}</em>
            </p>
          )}
          <p className='box'>{`${amount} ${fromCur} = ${converted} ${toCur}`}</p>
          <p>
            Result:&nbsp;
            <b>
              {converted}&nbsp;{toCur}
            </b>
          </p>
        </>
      )}
    </div>
  )
}

export default App
