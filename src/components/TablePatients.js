import axios from "axios";
import React from "react";
import Pagination from "./Pagination";
import { Eye, PencilSquare, Trash } from "react-bootstrap-icons";
import { ModalHeader, Modal, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';

const url = "http://127.0.0.1:8000/api/patients";
const urlD = "http://127.0.0.1:8000/api/doctors";
const urlR = "http://127.0.0.1:8000/api/records";

class TablePatients extends React.Component{
    state = {
        data:[],
        doctores:[],
        registros: [],
        currentPage: 1,
        registrosPerPage: 5,
        modalInsertar: false,
        modalEliminar: false,
        modalRecords: false,
        mensaje: '',
        form:{
            id: '',
            nombre: '',
            apellido: '',
            cedula: '',
            edad: '',
            tipoModal: ''
        }
    }

    peticionRegistros = async (paciente) => {
        await axios.get(urlR+'?txtBuscar='+paciente.id).then(response => {
            this.setState({registros: response.data});
            if(this.state.registros.length===0){
                this.mostrarAlertaR();
            }
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
            this.setState({mensaje: response.data.message});
            this.modalInsertar();
            this.mostrarAlerta();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
            this.setState({mensaje: 'Formulario llenado incorrectamente', icono: 'error'});
            this.mostrarAlerta();
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
            this.setState({mensaje: 'Formulario llenado incorrectamente', icono: 'error'});
            this.mostrarAlerta();
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

    seleccionarPaciente = (paciente) => {
        this.setState({
            tipoModal: 'actualizar',
            form:{
                id: paciente.id,
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                cedula: paciente.cedula,
                edad: paciente.edad
            }
        })
    }

    mostrarAlerta = () => {
        swal({
            text: this.state.mensaje,
            icon: 'success',
            buttons: 'Aceptar'
        })
    }

    mostrarAlertaR = () => {
        swal({
            text: 'No hay regsitros para mostrar',
            icon: 'warning',
            buttons: 'Aceptar'
        });
        this.setState({modalRecords: false});
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

    componentDidMount(){
        this.peticionGet();
        this.peticionGetDoctores();
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
                <button className="btn btn-success" onClick={() => {this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Paciente</button>
                <br/>
                <br/>
                <table className="table">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Cedula</th>
                            <th scope="col">Edad</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRegistro.map(paciente => {
                            return(
                                <tr key={paciente.id}>
                                    <td>{paciente.id}</td>
                                    <td>{paciente.nombre}</td>
                                    <td>{paciente.apellido}</td>
                                    <td>{paciente.cedula}</td>
                                    <td>{paciente.edad}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => {this.seleccionarPaciente(paciente); this.modalInsertar()}}><PencilSquare/></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => {this.seleccionarPaciente(paciente); this.setState({modalEliminar: true})}}><Trash/></button>
                                        {"   "}
                                        <button className="btn btn-success" onClick={() => {this.peticionRegistros(paciente); this.setState({modalRecords: true})}}><Eye/> Registros</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Pagination registrosPerPage={registrosPerPage} totalRegistros={data.length} paginate={paginate} nextPage={nextPage} prevPage={prevPage} currentPage={currentPage}/>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                    <span style={{float: 'center'}}>Ingrese los datos del Paciente</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">#</label>
                                <input type="text" className="form-control" name="id" id="id" aria-describedby="idHelp" readOnly onChange={this.handleChange} value={form ? form.id :''}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" id="nombre" aria-describedby="nombreHelp" onChange={this.handleChange} value={form ? form.nombre : ''}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="apellido" className="form-label">Apellido</label>
                                <input type="text" className="form-control" name="apellido" id="apellido" aria-describedby="apellidoHelp" onChange={this.handleChange} value={form ? form.apellido : ''}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cedula" className="form-label">Cedula</label>
                                <input type="text" className="form-control" name="cedula" id="cedula" aria-describedby="cedulaHelp" onChange={this.handleChange} value={form ? form.cedula : ''}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="edad" className="form-label">Edad</label>
                                <input type="number" className="form-control" name="edad" id="edad" aria-describedby="edadHelp" onChange={this.handleChange} value={form ? form.edad : ''}/>
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
                        Estás seguro de eliminar al paciente {form && form.nombre}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
                        <button className="btn btn-secundary" onClick={() => this.setState({modalEliminar: false})}>No</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalRecords} size="lg">
                    <ModalBody>
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
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.registros.map(record => {
                                    return(
                                        <tr key={record.id}>
                                            <td>{record.id}</td>
                                            <td>{this.state.data.map(paciente =>(paciente.id===record.patient_id ? paciente.nombre+' '+paciente.apellido : ''))}</td>
                                            <td>{this.state.doctores.map(doctor =>(doctor.id===record.doctor_id ? doctor.nombre+' '+doctor.apellido : ''))}</td>
                                            <td>{record.cita}</td>
                                            <td>{record.sintomas}</td>
                                            <td>{record.medicinas}</td>
                                            <td>{record.covid19}</td>
                                            <td>{record.description}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => this.setState({modalRecords: false})}>Cerrar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default TablePatients;