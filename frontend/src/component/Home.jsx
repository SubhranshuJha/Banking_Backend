import React from 'react'

const Home = () => {
  return (
    <div>
      <div className=' flex justify-left p-5 h-100'>
        <div className='bg-gray-200 p-10 rounded-lg shadow-lg w-96'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Welcome to the Bank</h2>
          <p className='text-gray-700 text-center'>Your trusted partner for all your banking needs.</p>
        </div>
        <div className='bg-gray-200 p-10 rounded-lg shadow-lg w-96 ml-10'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Our Services</h2>
          <ul className='list-disc list-inside text-gray-700'>
            <li>Checking and Savings Accounts</li>
            <li>Loans and Mortgages</li>
            <li>Credit Cards</li>
            <li>Online and Mobile Banking</li>
          </ul>
        </div>
        <div className='bg-gray-200 p-10 rounded-lg shadow-lg w-96 ml-10'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Why Choose Us?</h2>
          <ul className='list-disc list-inside text-gray-700'>
            <li>Competitive Interest Rates</li>
            <li>24/7 Customer Support</li>
            <li>Secure and Convenient Banking</li>
            <li>Community Involvement</li>
          </ul>
        </div>
        

      </div>
    </div>
  )
}

export default Home
