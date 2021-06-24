
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg';

type RoomParams = {
    id: string
}

export function Room() {

    const { user } = useAuth()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [ newQuestion, setNewQuestion ] = useState('');

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        
        if(newQuestion.trim() === ''){
            return
        };

        if(!user) 
            throw new Error('You must login to ask questions')
            
            const question = {
                content: newQuestion,
                author: {
                    name: user?.name,
                    avatar: user?.avatar,
                },
                isHighLighted: false,
                isAnswered: false,
            };
            
            await database.ref(`rooms/${roomId}/questions`).push(question);
        }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="logo Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Nome da sala</h1>
                    <span>N perguntas</span>
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?" 
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        <Button type="submit">Enviar pergunta</Button>
                    </div>
                </form>

            </main>
        </div>
    );
};