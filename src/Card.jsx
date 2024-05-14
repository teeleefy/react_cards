import { useState } from 'react'
import './Card.css'
import { v4 as uuid } from 'uuid'

function Card ({image}) {
    const [angle, setAngle] = useState(Math.random() * 60)
    const transform = `rotate(${angle}deg)`
    return (
        <>
            <img className="Card" src={image} style= { {transform} }/>
        </>
    )
}

export default Card;

