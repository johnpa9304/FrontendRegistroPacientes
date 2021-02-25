import axios from "axios";
import React from "react";
import Pagination from "./Pagination";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { ModalHeader, Modal, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';

const url = "http://127.0.0.1:8000/api/doctors";

class TableDoctors extends React.Component{
    state = {
        data:[],
        currentPage: 1,
        registrosPerPage: 10,
        modalInsertar: false,
        modalEliminar: false,
        mensaje: '',
        icono: '',
        form:{
            id: '',
            nombre: '',
            apellido: '',
            cedula: '',
            Especialidad: '',
            tipoModal: ''
        }
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
            this.setState({mensaje: 'Tiene que borrar primero los registros del Doctor', icono: 'error'});
            this.mostrarAlerta();
        })
    }

    modalInsertar = () => {
        this.setState({modalInsertar: !this.state.modalInsertar});
    }

    seleccionarDoctor = (doctor) => {
        this.setState({
            tipoModal: 'actualizar',
            form:{
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
                <button className="btn btn-success" onClick={() => {this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Doctor</button>
                <br/>
                <br/>
                <table className="table">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Cedula</th>
                            <th scope="col">Especialidad</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRegistro.map(doctor => {
                            return(
                                <tr key={doctor.id}>
                                    <td>{doctor.id}</td>
                                    <td>{doctor.nombre}</td>
                                    <td>{doctor.apellido}</td>
                                    <td>{doctor.cedula}</td>
                                    <td>{doctor.Especialidad}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => {this.seleccionarDoctor(doctor); this.modalInsertar()}}><PencilSquare/></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => {this.seleccionarDoctor(doctor); this.setState({modalEliminar: true})}}><Trash/></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Pagination registrosPerPage={registrosPerPage} totalRegistros={data.length} paginate={paginate} nextPage={nextPage} prevPage={prevPage} currentPage={currentPage}/>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                    <span style={{float: 'center'}}>Ingrese los datos del Doctor</span>
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
                                <label htmlFor="Especialidad" className="form-label">Especialidad</label>
                                <input type="text" className="form-control" name="Especialidad" id="Especialidad" aria-describedby="EspecialidadHelp" onChange={this.handleChange} value={form ? form.Especialidad : ''}/>
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
                        Estás seguro de eliminar al Doctor {form && form.nombre} {form && form.apellido}
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

export default TableDoctors;