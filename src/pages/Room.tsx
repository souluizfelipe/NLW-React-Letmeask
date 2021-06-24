
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}>

type Questions = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}


type RoomParams = {
    id: string,
}

export function Room() {

    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [ newQuestion, setNewQuestion ] = useState('');
    const [ questions, setQuestions ] = useState<Questions[]>([]);
    const [ title, setTitle ] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                };
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
    }, [roomId]);

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
                isHighlighted: false,
                isAnswered: false,
            };
            
            await database.ref(`rooms/${roomId}/questions`).push(question);

            setNewQuestion('')
        };

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
                    <h1>{title}</h1>
                    {questions.length > 0 && ( questions.length == 1 ? <span>{questions.length} pergunta</span> : <span>{questions.length} perguntas</span>)} 

                    


                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        disabled={!user}
                        placeholder="O que você quer perguntar?" 
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span className='user-name'>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        ) }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

            </main>
        </div>
    );
};