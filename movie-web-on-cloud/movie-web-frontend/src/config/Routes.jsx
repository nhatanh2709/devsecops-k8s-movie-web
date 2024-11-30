import React from 'react'
import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import Detail from '../pages/detail/Detail'
import { Route,Routes } from 'react-router-dom'
const RoutesComponent = () => {
  return (
    <Routes>
        <Route path='/:category/search/:keyword' component={Catalog}/>
        <Route path='/:category/:id' component={Detail}/>
        <Route path='/:category' component={Catalog}/>
        <Route path='/' exact component={Home}/>
    </Routes>
  );
}

export default RoutesComponent
