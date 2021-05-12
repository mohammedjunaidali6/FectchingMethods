import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';

const baseUrl='http://localhost:3004/posts/'

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
const styles= useStyles();
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [consolaSeleccionada, setConsolaSeleccionada]=useState({
    name: '',
    email:'',
    address: '',
    phone: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setConsolaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(consolaSeleccionada);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, consolaSeleccionada)
    .then(response=>{
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+consolaSeleccionada.id, consolaSeleccionada)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(consola=>{
        if(consolaSeleccionada.id===consola.id){
          consola.name=consolaSeleccionada.name;
          consola.email=consolaSeleccionada.email;
          consola.address=consolaSeleccionada.address;
          consola.phone=consolaSeleccionada.phone;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+consolaSeleccionada.id)
    .then(response=>{
      setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
      abrirCerrarModalEliminar();
    })
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const seleccionarConsola=(consola, caso)=>{
    setConsolaSeleccionada(consola);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(async()=>{
    await peticionGet();
  },[])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>ADD DETAILS</h3>
      <TextField name="name" className={styles.inputMaterial} label="Name" onChange={handleChange}/>
      <br />
      <TextField name="email" className={styles.inputMaterial} label="Email" onChange={handleChange}/>
      <br />
      <TextField name="address" className={styles.inputMaterial} label="Address" onChange={handleChange}/>
      <br />
      <TextField name="phone" className={styles.inputMaterial} label="Phone" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insert</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>EDIT DETAILS</h3>
      <TextField name="name" className={styles.inputMaterial} label="Name" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.name}/>
      <br />
      <TextField name="email" className={styles.inputMaterial} label="Email" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.email}/>
      <br />
      <TextField name="address" className={styles.inputMaterial} label="Address" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.address}/>
      <br />
      <TextField name="phone" className={styles.inputMaterial} label="Phone" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.phone}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Edit</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Are u sure you want to delete <b>{consolaSeleccionada && consolaSeleccionada.name}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >yes</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )


  return (
    <div className="App">
      <br />
    <Button onClick={()=>abrirCerrarModalInsertar()}>ADD USER</Button>
      <br /><br />
     <TableContainer>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>Name</TableCell>
             <TableCell>Email</TableCell>
             <TableCell>Address</TableCell>
             <TableCell>Phone</TableCell>
             <TableCell>Actions</TableCell>
           </TableRow>
         </TableHead>

         <TableBody>
           {data.map(post=>(
             <TableRow key={post.id}>
               <TableCell>{post.name}</TableCell>
               <TableCell>{post.email}</TableCell>
               <TableCell>{post.address}</TableCell>
               <TableCell>{post.phone}</TableCell>
               <TableCell>
                 <Edit className={styles.iconos} onClick={()=>seleccionarConsola(post, 'Editar')}/>
                 &nbsp;&nbsp;&nbsp;
                 <Delete  className={styles.iconos} onClick={()=>seleccionarConsola(post, 'Eliminar')}/>
                 </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>
     
     <Modal
     open={modalInsertar}
     onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
     </Modal>

     <Modal
     open={modalEditar}
     onClose={abrirCerrarModalEditar}>
        {bodyEditar}
     </Modal>

     <Modal
     open={modalEliminar}
     onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
     </Modal>
    </div>
  );
}

export default App;

