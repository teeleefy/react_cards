import { useState, useEffect, useRef } from 'react'
import axios from "axios";
import './Deck.css'
import Card from './Card'



function Deck () {
    const [ deck, setDeck ] = useState(null);
    const [showCardBack, setShowCardBack] = useState(true)
    const [remainingCards, setRemainingCards] = useState(null)
    const [ cards, setCards ] = useState([]);
    const [ deckId, setDeckId ] = useState(null);
    const [ canShuffle , setCanShuffle ] = useState(true);

    useEffect(function fetchDeckFromAPI(){
        async function fetchDeck(){
            const deckResult = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            setDeck(deckResult.data);
            setDeckId(deckResult.data.deck_id);
            setRemainingCards(deckResult.data.remaining);
            
        }
        fetchDeck();
    }, []);
    
    const addCard = card => {
        let newCard = { id: card.code, image: card.image };
        setCards(cards => [...cards, newCard])
    }

    async function fetchCard(){
            try{
                //draw card from deck through api call
                const cardResult = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
                //set remaining state count
                const remainingCardCount = cardResult.data.remaining;
                setRemainingCards(remainingCardCount);
                //set newCard from api data
                const newCard = cardResult.data.cards[0];
                //addCard to cards state
                addCard(newCard)
                //if no more remaining cards, hide card logo and show DECK EMPTY 
                if(remainingCards === 1){
                    setShowCardBack(false);
                    setRemainingCards("DECK EMPTY")
                }
            }
            catch(err){
                alert(err);
                
            }
            
        }

    async function shuffleDeck(){
        try{
            setCanShuffle(false);
            console.log('you CANNOT shuffle now')
            const deckResult = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
            setRemainingCards(deckResult.data.remaining);
            setShowCardBack(true);
            setCards([]);
            console.log('you can shuffle now');
            setCanShuffle(true);
        }
        catch(err){
            alert(err);
        }
    }
     
    const renderCards = () => {
        return (
            <>
                <h1 className="Deck-header">Remaining Cards: {remainingCards}</h1>
                { canShuffle ? <button className="Deck-shuffle" onClick={shuffleDeck}>Shuffle Deck</button> : <button className="Deck-shuffle" >Shuffle Deck</button>}
                
                {cards.map(card => (<Card image={card.image} key={card.id}/>))}
            </>    
        )
    }

    return (
        <>
            {showCardBack && <img src="https://deckofcardsapi.com/static/img/back.png" onClick={fetchCard}/>}
            {renderCards()}
            
        </>
    )
}

export default Deck;