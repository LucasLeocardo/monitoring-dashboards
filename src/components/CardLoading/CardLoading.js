import './cardLoading.css';
import cardLoader from '../../assets/cardLoader.svg';

function CardLoading() {
    return (
        <div className='cardLoaderContainer'>
            <img src={cardLoader} alt='Loading' />
        </div>
    );
}

export default CardLoading;