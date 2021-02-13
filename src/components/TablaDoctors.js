import axios from "axios";
import React from "react";

const url = "http://127.0.0.1:8000/api/doctors";

class TableDoctors extends React.Component{
    state = {
        data:[]
    }

    peticionGet = () => {
        axios.get(url).then(response => {
            this.setState({data: response.data});
        })
    }

    componentDidMount(){
        this.peticionGet();
    }

    render(){
        return(
            <table class="table">
                <thead class="table-primary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Cedula</th>
                        <th scope="col">Especialidad</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map(doctores => {
                        return(
                            <tr key={doctores.id}>
                                <td>{doctores.id}</td>
                                <td>{doctores.nombre}</td>
                                <td>{doctores.apellido}</td>
                                <td>{doctores.cedula}</td>
                                <td>{doctores.Especialidad}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }
}

export default TableDoctors;