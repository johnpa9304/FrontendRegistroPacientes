import axios from "axios";
import React from "react";

const url = "http://127.0.0.1:8000/api/records";

class TableRecords extends React.Component{
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
                        <th scope="col">Paciente</th>
                        <th scope="col">Doctor</th>
                        <th scope="col">Cita</th>
                        <th scope="col">Sintomas</th>
                        <th scope="col">Medicinas</th>
                        <th scope="col">Covid19</th>
                        <th scope="col">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map(records => {
                        return(
                            <tr key={records.id}>
                                <td>{records.id}</td>
                                <td>{records.patient_id}</td>
                                <td>{records.doctor_id}</td>
                                <td>{records.cita}</td>
                                <td>{records.sintomas}</td>
                                <td>{records.medicinas}</td>
                                <td>{records.covid19}</td>
                                <td>{records.description}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }
}

export default TableRecords;