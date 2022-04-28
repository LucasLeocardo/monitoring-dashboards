import { useState } from 'react';
import logo from '../../assets/logo-tree.png';
import './signin.css';


function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  function handleSubmit(e) {
    e.preventDefault();
    alert('CLICOU');
  }

    return (
      <div className='container-center'>
        <div className='login'>
          <div className='login-area'>
            <img src={logo} alt='System logo'/>
          </div>
          <form onSubmit={handleSubmit}>
              <h1>Login SMS</h1>
              <input type='text' placeholder='email@email.com' value={email} onChange={ (e) => setEmail(e.target.value) }/>
              <input type='password' placeholder='******' value={password} onChange={ (e) => setPassword(e.target.value) }/>
              <button type='submit'>Access</button>
          </form>
        </div>
      </div>
    );
}
  
export default SignIn;