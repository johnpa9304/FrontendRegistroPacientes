import axios from "axios";
import React from "react";
import Pagination from "./Pagination";
import { Calendar2Event, PencilSquare, Trash } from "react-bootstrap-icons";
import { ModalHeader, Modal, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';

const url = "http://127.0.0.1:8000/api/records";
const urlP = "http://127.0.0.1:8000/api/patients";
const urlD = "http://127.0.0.1:8000/api/doctors";

class TableRecords extends React.Component{
    state = {
        data:[],
        pacientes:[],
        doctores:[],
        currentPage: 1,
        registrosPerPage: 5,
        modalInsertar: false,
        modalEliminar: false,
        mensaje: '',
        icono: '',
        form:{
            id: '',
            patient_id: '',
            doctor_id: '',
            cita: '',
            sintomas: '',
            medicinas: '',
            covid19: '',
            description: '',
            tipoModal: ''
        },
        doctor:{
            id: '',
            nombre: '',
            apellido: '',
            cedula: '',
            Especialidad: ''
        }
    }

    peticionGetPacientes = async () => {
        await axios.get(urlP).then(response => {
            this.setState({pacientes: response.data});
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGetDoctores = async () => {
        await axios.get(urlD).then(response => {
            this.setState({doctores: response.data});
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGet = async () => {
        await axios.get(url).then(response => {
            this.setState({data: response.data});
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => {
        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
            this.setState({mensaje: response.data.message, icono: 'success'});
            this.modalInsertar();
            this.mostrarAlerta();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPut = () => {
        axios.put(url+'/'+this.state.form.id, this.state.form).then(response => {
            this.setState({mensaje: response.data.message, icono: 'success'});
            this.modalInsertar();
            this.mostrarAlerta();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionDelete = () => {
        axios.delete(url+'/'+this.state.form.id).then(response => {
            this.setState({mensaje: response.data.message, icono: 'success'});
            this.setState({modalEliminar: false});
            this.mostrarAlerta();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    modalInsertar = () => {
        this.setState({modalInsertar: !this.state.modalInsertar});
    }

    seleccionarRecord = (record) => {
        this.setState({
            tipoModal: 'actualizar',
            form:{
                id: record.id,
                patient_id: record.patient_id,
                doctor_id: record.doctor_id,
                cita: record.cita,
                sintomas: record.sintomas,
                medicinas: record.medicinas,
                covid19: record.covid19,
                description: record.description
            }
        })
    }

    seleccionarDoctor = (doctor) => {
        this.setState({
            doctor:{
                id: doctor.id,
                nombre: doctor.nombre,
                apellido: doctor.apellido,
                cedula: doctor.cedula,
                Especialidad: doctor.Especialidad
            }
        })
    }

    mostrarAlerta = () => {
        swal({
            text: this.state.mensaje,
            icon: this.state.icono,
            buttons: 'Aceptar'
        })
    }

    componentDidMount(){
        this.peticionGet();
        this.peticionGetPacientes();
        this.peticionGetDoctores();
    }

    handleChange = async e => {
        e.persist();
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    render(){
        const { currentPage, registrosPerPage, data, form } = this.state;

        const indexOfLastRegistro = currentPage * registrosPerPage;
        const indexOfFirstRegistro = indexOfLastRegistro - registrosPerPage;
        const currentRegistro = data.slice(indexOfFirstRegistro, indexOfLastRegistro);
    
        const paginate = pageNum => this.setState({ currentPage: pageNum });
    
        const nextPage = () => this.setState({ currentPage: currentPage + 1 });
    
        const prevPage = () => this.setState({ currentPage: currentPage - 1 });

        return(
            <React.Fragment>
                <br/>
                <button className="btn btn-success" onClick={() => {this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Registro</button>
                <br/>
                <br/>
                <table className="table">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Paciente</th>
                            <th scope="col">Doctor</th>
                            <th scope="col">Cita</th>
                            <th scope="col">Sintomas</th>
                            <th scope="col">Medicinas</th>
                            <th scope="col">Covid19</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRegistro.map(record => {
                            return(
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{this.state.pacientes.map(paciente =>(paciente.id===record.patient_id ? paciente.nombre+' '+paciente.apellido : ''))}</td>
                                    <td>{this.state.doctores.map(doctor =>(doctor.id===record.doctor_id ? doctor.nombre+' '+doctor.apellido : ''))}</td>
                                    <td>{record.cita}</td>
                                    <td>{record.sintomas}</td>
                                    <td>{record.medicinas}</td>
                                    <td>{record.covid19}</td>
                                    <td>{record.description}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => {this.seleccionarRecord(record); this.modalInsertar()}}><PencilSquare/></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => {this.seleccionarRecord(record); this.setState({modalEliminar: true})}}><Trash/></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Pagination registrosPerPage={registrosPerPage} totalRegistros={data.length} paginate={paginate} nextPage={nextPage} prevPage={prevPage} currentPage={currentPage}/>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'center'}}>Ingrese los datos del Registro</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">#</label>
                                <input type="text" className="form-control" name="id" id="id" aria-describedby="idHelp" readOnly onChange={this.handleChange} value={form ? form.id : ''}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="patient_id" className="form-label">Paciente:</label>
                                {"   "}
                                <select id="patient_id" name="patient_id" className="form-select" onChange={this.handleChange}>
                                    <option>{form ? this.state.pacientes.map(paciente =>(paciente.id===form.patient_id ? paciente.nombre+' '+paciente.apellido : '')) :'Selccione una opción'}</option>
                                    {this.state.pacientes.map(paciente => (                                        
                                        <option key={paciente.id} value={paciente.id}>{paciente.nombre} {paciente.apellido}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="doctor_id" className="form-label">Doctor:</label>
                                {"   "}
                                <select id="doctor_id" name="doctor_id" className="form-select" onChange={this.handleChange}>
                                <option>{form ? this.state.doctores.map(doctor =>(doctor.id===form.doctor_id ? doctor.nombre+' '+doctor.apellido : '')) :'Selccione una opción'}</option>
                                    {this.state.doctores.map(doctor => (
                                        <option key={doctor.id} value={doctor.id} onClick={() => this.seleccionarDoctor(doctor)}>{doctor.nombre} {doctor.apellido}</option>
                                    ))}
                                </select>
                            </div>
                            <label htmlFor="cita" className="form-label">Cita</label>
                            <div className="input-group mb-3">                                
                                <input type="date" className="form-control" name="cita" id="cita" aria-describedby="citaHelp" onChange={this.handleChange} value={form ? form.cita : ''}/>
                                <span className="input-group-text" id="basic-addon1"><Calendar2Event/></span>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sintomas" className="form-label">Sintomas</label>
                                <input type="text" className="form-control" name="sintomas" id="sintomas" aria-describedby="sintomasHelp" onChange={this.handleChange} value={form ? form.sintomas : ''}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="medicinas" className="form-label">Medicinas</label>
                                <input type="text" className="form-control" name="medicinas" id="medicinas" aria-describedby="medicinasHelp" onChange={this.handleChange} value={form ? form.medicinas : ''}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="covid19" className="form-label">Covid19:    </label>
                                {"    "}
                                <label>Sí</label>
                                {"    "}
                                <input
                                    type="radio"
                                    name="covid19"
                                    value="1"
                                    onChange={this.handleChange}
                                />
                                {"    "}
                                <label>No</label>
                                {"    "}
                                <input
                                    type="radio"
                                    name="covid19"
                                    value="0"
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Descripción</label>
                                <input type="text" className="form-control" name="description" id="description" aria-describedby="descriptionHelp" onChange={this.handleChange} value={form ? form.description : ''}/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className="btn btn-success" onClick={() => this.peticionPost()}>Insertar</button> :
                            <button className="btn btn-primary" onClick={() => this.peticionPut()}>Actualizar</button>
                        }
                        <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Estás seguro de eliminar el registro
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
                        <button className="btn btn-secundary" onClick={() => this.setState({modalEliminar: false})}>No</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default TableRecords;