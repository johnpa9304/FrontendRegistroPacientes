import axios from "axios";
import React from "react";
import Pagination from "./Pagination";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Model, ModelBody, MadalFooter, ModalHeader, Modal, ModalBody, ModalFooter } from 'reactstrap';

const url = "http://127.0.0.1:8000/api/patients";

class TablePatients extends React.Component{
    state = {
        data:[],
        currentPage: 1,
        registrosPerPage: 5,
        modalInsertar: false,
        form:{
            id: '',
            nombre: '',
            apellido: '',
            cedula: '',
            edad: ''
        }
    }

    peticionGet = () => {
        axios.get(url).then(response => {
            this.setState({data: response.data});
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => {
        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    modalInsertar = () => {
        this.setState({modalInsertar: !this.state.modalInsertar});
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
                <button className="btn btn-success" onClick={() => this.modalInsertar()}>Agregar Paciente</button>
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
                                        <button className="btn btn-primary"><PencilSquare/></button>
                                        {"   "}
                                        <button className="btn btn-danger"><Trash/></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Pagination postsPerPage={registrosPerPage} totalPosts={data.length} paginate={paginate} nextPage={nextPage} prevPage={prevPage}/>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'right'}}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">#</label>
                                <input type="text" className="form-control" name="id" id="id" aria-describedby="idHelp" readOnly onChange={this.handleChange} value={form.id}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input type="text" className="form-control" name="nombre" id="nombre" aria-describedby="nombreHelp" onChange={this.handleChange} value={form.nombre}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="apellido" className="form-label">Apellido</label>
                                <input type="text" className="form-control" name="apellido" id="apellido" aria-describedby="apellidoHelp" onChange={this.handleChange} value={form.apellido}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cedula" className="form-label">Cedula</label>
                                <input type="text" className="form-control" name="cedula" id="cedula" aria-describedby="cedulaHelp" onChange={this.handleChange} value={form.cedula}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="edad" className="form-label">Edad</label>
                                <input type="number" className="form-control" name="edad" id="edad" aria-describedby="edadHelp" onChange={this.handleChange} value={form.edad}/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={() => this.peticionPost()}>Insertar</button>
                        <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default TablePatients;