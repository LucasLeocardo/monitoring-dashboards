import './loading.css';
import loading from '../../assets/loader.svg';

function Loading() {
    return (
        <div className='loaderContainer'>
            <img src={loading} alt='Loading' />
        </div>
    );
}

export default Loading;