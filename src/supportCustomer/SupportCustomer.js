import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import Logo from '../images/logo.png'
import Table from 'react-bootstrap/Table'
import { Modal } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { FormLabel } from 'react-bootstrap';
import './SupportCustomer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const requestDomain = document.getElementById("requestPath").getAttribute("data-server");
const MySwal = withReactContent(Swal);

export default function SupportCustomer() {
    //Estados
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    //Para cambiar campos
    const [showId, setId] = useState('');
    const [showName, setName] = useState('');
    const [showLastName, setLastName] = useState('');
    const [showDateOfBirth, setDateOfBirth] = useState('');
    const [showEmailAddress, setEmailAddress] = useState('');
    const [showRol, setRol] = useState();
    const [showStatus, setStatus] = useState();
    const [showGender, setGender] = useState('');


    //GET cashers
    const [listCustomer, setListCustomer] = useState([]);
    useEffect(() => {
        getEventCustomer();
    }, []);

    var getEventCustomer = async function () {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let resp = await fetch(requestDomain + "/admin/getClients",
            {
                headers: myHeaders,
                method: "GET"
            }
        );
        let awResp = await resp.json();
        //const awResp2 = Array.from(awResp);
        //const awResp2 = Object.values(awResp);
        setListCustomer(awResp);
        return;
    };

    //DELETE cashier
    var deleteEventCustomer = async function (id, name) {
        MySwal.fire({
            title: '¿Estas seguro?',
            html: "Si elimina este cliente <strong class='text-danger'>"+name+"</strong> sera definitivo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let resp = await fetch(requestDomain + "/admin/deleteClients/" + id,
                    {
                        method: "DELETE"
                    }
                );
                let auxResp = await resp.json();
                getEventCustomer();
                Swal.fire(
                    auxResp.mssg,
                    (auxResp.status === 1) ? "<i>Cliente eliminado</i>" : "<i>ERROR</i>",
                    (auxResp.status === 1) ? 'success' : 'error'
                )
            }
        })
        return;
    };

    //Get ONE cashier
    var getEventOneCustomer = async function (id) {
        let resp = await fetch(requestDomain + "/admin/getClient/" + id,
            {
                method: "GET"
            }
        );
        let awResp = await resp.json();
        //const arrResp = Array.from(awResp);
        const arrResp = Object.values(awResp);

        let idUpdate = arrResp[0];
        let name = arrResp[1];
        let lastName = arrResp[2];
        let dateOfBirth = arrResp[3];
        let emailAddress = arrResp[4];
        let rol = arrResp[5];
        let status = arrResp[6];
        let gender = arrResp[7];

        setId(idUpdate);
        setName(name);
        setLastName(lastName);
        setDateOfBirth(dateOfBirth);
        setEmailAddress(emailAddress);
        setRol(rol);
        setStatus(status);
        setGender(gender);

        return;
    };

    //UPDATE cashier
    var updateEventCustomer = async function (id) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let resp = await fetch(requestDomain + "/admin/clients/" + id,
            {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify(
                    {
                        name: document.getElementById("nameUpdate").value,
                        lastName: document.getElementById("lastNameUpdate").value,
                        dateOfBirth: document.getElementById("dateOfBirthUpdate").value,
                        emailAddress: document.getElementById("emailAddressUpdate").value,
                        rol: document.getElementById("rolUpdate").value,
                        status: document.getElementById("statusUpdate").value,
                        gender: document.getElementById("genderUpdate").value
                    }
                )
            }
        );

        let auxResp = await resp.json();
        getEventCustomer();
        await MySwal.fire({
            tittle: "<strong>" + auxResp.mssg + "</strong>",
            html: (auxResp.status === 1) ? <i>Cliente modificado</i> : <i>ERROR</i>,
            icon: (auxResp.status === 1) ? 'success' : 'error'
        })
        return;
    };

    //ADD cashier
    var addEventCustomer = async function () {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let resp = await fetch(requestDomain + "/admin/addClient",
            {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(
                    {
                        name: document.getElementById("name").value,
                        lastName: document.getElementById("lastName").value,
                        dateOfBirth: document.getElementById("dateOfBirth").value,
                        emailAddress: document.getElementById("emailAddress").value,
                        rol: document.getElementById("rol").value,
                        status: document.getElementById("status").value,
                        gender: document.getElementById("gender").value
                    }
                )
            }
        );

        let auxResp = await resp.json();
        getEventCustomer();
        await MySwal.fire({
            tittle: "<strong>" + auxResp.mssg + "</strong>",
            html: (auxResp.status === 1) ? <i>Cliente agregado</i> : <i>ERROR</i>,
            icon: (auxResp.status === 1) ? 'success' : 'error'
        })
        return;
    };

    function FormModalCustomer(props) {
        return (
            <Modal {...props} className="modal" aria-labelledby="contained-modal-title-center">
                <Modal.Header closeButton>
                    <h1>Nuevo Cliente</h1>
                </Modal.Header>
                <Modal.Body className="modalBody">
                    <>
                        <FormLabel> Nombre *</FormLabel>
                        <FormControl id="name" />

                        <FormLabel> Apellidos *</FormLabel>
                        <FormControl id="lastName" />

                        <FormLabel> Fecha de nacimiento *</FormLabel>
                        <FormControl id="dateOfBirth" type="text" />

                        <FormLabel> Correo electrónico *</FormLabel>
                        <FormControl id="emailAddress" type="email" />

                        <FormLabel> Rol *</FormLabel>
                        <FormControl id="rol" type="text" />

                        <FormLabel> Estatus *</FormLabel>
                        <FormControl id="status" />

                        <FormLabel> Genero *</FormLabel>
                        <FormControl id="gender" />
                    </>
                </Modal.Body>
                <Modal.Footer>
                    <>
                        <Button variant="secondary" onClick={() => { setShowAdd(false) }}>Cancelar</Button>
                        <Button variant="primary" onClick={addEventCustomer}>Guardar</Button>
                    </>
                </Modal.Footer>
            </Modal >
        )
    }

    function FormModalCustomerUpdate(props) {
        return (
            <Modal {...props} className="modal" aria-labelledby="contained-modal-title-center">
                <Modal.Header closeButton>
                    <h1>Modificar Cliente</h1>
                </Modal.Header>
                <Modal.Body className="modalBody">
                    <>
                        <FormLabel> Nombre *</FormLabel>
                        <FormControl id="nameUpdate" value={showName} onChange={(e) => setName(e.target.value)} />

                        <FormLabel> Apellidos *</FormLabel>
                        <FormControl id="lastNameUpdate" type="text" value={showLastName} onChange={(e) => setLastName(e.target.value)} />

                        <FormLabel> Fecha de nacimiento *</FormLabel>
                        <FormControl id="dateOfBirthUpdate" type="text" value={showDateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />

                        <FormLabel> Correo electrónico *</FormLabel>
                        <FormControl id="emailAddressUpdate" type="email" value={showEmailAddress} onChange={(e) => setEmailAddress(e.target.value)} />

                        <FormLabel> Rol *</FormLabel>
                        <FormControl id="rolUpdate" value={showRol} onChange={(e) => setRol(e.target.value)} />

                        <FormLabel> Estatus *</FormLabel>
                        <FormControl id="statusUpdate" value={showStatus} onChange={(e) => setStatus(e.target.value)} />

                        <FormLabel> Genero *</FormLabel>
                        <FormControl id="genderUpdate" value={showGender} onChange={(e) => setGender(e.target.value)} />
                    </>
                </Modal.Body>
                <Modal.Footer>
                    <>
                        <Button variant="secondary" onClick={() => { setShowAdd(false) }}>Cancelar</Button>
                        <Button variant="primary" onClick={() => updateEventCustomer(showId)}>Guardar</Button>
                    </>
                </Modal.Footer>
            </Modal >
        );
    }


    return (

        <Container className="supportCustomer" fluid >
            <Row className="row-header">
                <Col sm={3} md={4} lg={4}>
                    <Image cclassName="logo mt-4" src={Logo}></Image>
                </Col >
                <Col className="text-center" sm={7} md={4} lg={4}>
                    <h2 className="mt-4">Catálogo de Clientes</h2>
                </Col>
                <Col sm={2} md={4} lg={4}>
                    <Button style={{ float: "right" }} className="button-close mt-4" variant="primary" href="/logout">Cerrar sesión</Button>
                </Col>
            </Row>
            <Row className="justify-content-md-end">
                <Col lg={11}>
                    <Button className="mb-3 add-customer" variant="light" onClick={() => { setShow(true) }}>Nuevo Cliente <FontAwesomeIcon className="icon-plus" icon={faPlus} /></Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table className="table-customers" bordered size="sm" responsive>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Fecha de Nacimiento</th>
                                <th>Correo electrónico</th>
                                <th>Rol</th>
                                <th>Estatus</th>
                                <th>Género</th>
                                {/* <th>Editar</th> */}
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCustomer.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.lastName}</td>
                                    <td>{product.dateOfBirth}</td>
                                    <td>{product.emailAddress}</td>
                                    <td>{product.rol}</td>
                                    <td>{product.status}</td>
                                    <td>{product.gender}</td>
                                   {/*  <td>
                                        <Button className="mb-3 add-product" variant="light" onClick={() => {
                                            getEventOneCustomer(product._id);
                                            setShowUpdate(true);
                                        }}>
                                            ✏️
                                        </Button>
                                    </td> */}
                                    <td>
                                        <Button className="mb-3 add-product" variant="light" onClick={() => deleteEventCustomer(product._id, product.name)}>
                                            <FontAwesomeIcon className="icon-trash" icon={faTrashAlt} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <FormModalCustomer
                show={show}
                onHide={() => setShow(false)}
            />
            <FormModalCustomer
                show={showAdd}
                onHide={() => setShowAdd(false)}
            />
            <FormModalCustomerUpdate
                show={showUpdate}
                onHide={() => setShowUpdate(false)}
            />
        </Container>
    )
}
