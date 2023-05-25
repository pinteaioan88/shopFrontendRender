import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
    }

  return (
    <Form onSubmit={submitHandler} className='d-flex m-auto' style={{ height: '2.8rem' }}> 
        <Form.Control 
            type='text'
            name='q'
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Search Products...'
            className='me-md-1 rounded'>

        </Form.Control>
        <Button
            type='submit'
            variant='outline-success'
            className='p-2 rounded searchButton text-capitalize'>
                Search
            </Button>
    </Form>
  )
}

export default SearchBox