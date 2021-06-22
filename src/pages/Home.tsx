import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';
import { Button } from '../components/Button'

import '../styles/auth.scss';

export function Home() {
    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="ilustração perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="logo Letmeask" />
                    <button className="create-room">
                        <img src={googleIcon} alt="icone do google" />
                        Crie sua sala com o Goole
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                     <form>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
};