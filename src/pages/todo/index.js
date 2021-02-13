import React from 'react';
import Layout from '../../components/layout';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Pacientes from '../../containers/Pacientes';
import Home from '../../containers/Home';
import Doctors from '../../containers/Doctors';
import Records from '../../containers/Records';


function TodoPage(props){
    return (
        <BrowserRouter>
            <Layout>
            <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/pacientes" component={Pacientes}></Route>
                <Route exact path="/doctores" component={Doctors}></Route>
                <Route exact path="/registros" component={Records}></Route>
            </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default TodoPage;