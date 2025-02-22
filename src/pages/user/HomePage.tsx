import React from 'react'
import Banner from '../../components/user/Banner'
import Header from "../../components/user/Header"
import Footer from "../../components/user/Footer"
import ServicesFeatures from '../../components/user/ServicesFeatures'
function HomePage() {
  return (
    <div>
       <Header/>
      <Banner/>
      <ServicesFeatures/>
      <Footer/>
    </div>
  )
}

export default HomePage
