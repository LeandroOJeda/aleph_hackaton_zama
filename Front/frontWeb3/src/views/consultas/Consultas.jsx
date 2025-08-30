import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAuto } from '../../redux/action'
import VehicleDisplay from '../visualizadorDatos/VisualizadorDatos'

function Consultas() {
    const dispatch = useDispatch()
    const [patente, setPatente] = useState("")
    const [data, setData] = useState({})
    const [empty, setEmpty] = useState(false)

    const handleChange = (event) => {
        setPatente(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("llega aca");

        setData(dispatch(getAuto(patente)))
        if (data) { setEmpty(true) }


    }
    console.log(data);

    return (

        <div>
            <h1>Consultas</h1>
            <h3>Ingrese patente o Número de chasis</h3>
            {/* <form onSubmit={handleSubmit}> */}
            <input
                type='text'
                id="patente"
                placeholder='patente o número de chasis'
                onChange={handleChange}></input>
            <button type='submit' onClick={handleSubmit}>Buscar</button>
            {/* </form> */}
            {
                empty && <VehicleDisplay vehicleData={data} />
            }
        </div>
    )
}

export default Consultas