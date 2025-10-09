import './style.css';

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { InputField } from "../ui/InputField"
import { Checkbox } from '../ui/Checkbox';
import { Col, Container, Row } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import { CreateOBSConnection } from '../../lib/obsConnection';
import OBSWebSocket from 'obs-websocket-js';

interface OBSAuthenticationProps {
    onConnect: Dispatch<SetStateAction<OBSWebSocket | undefined>>,
}

export const OBSAuthentication = ({
    onConnect,
}: OBSAuthenticationProps) => {
    const queryClient = useQueryClient();

    const [port, setPort] = useState<string>("");
    const [useAuthentication, setUseAuthentication] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");
    
    const connectToOBS = async (options: { url: string, password?: string}) => {
        let response;

        try {
            response = await queryClient.fetchQuery({
                queryKey: [
                    "url", options.url,
                    "password", options.password,
                ],
                queryFn: () => CreateOBSConnection(options.url, options.password),
            });            
        } catch (error) {
            console.log("Erro ao tentar autenticar no OBS: ", error);
            console.log(response);
            return;
        }

        onConnect(response);
    }

    const handleConnectObs = async (event: FormEvent) => {
        event.preventDefault();
        await connectToOBS({
            url: "ws://127.0.0.1:" + port,
            password: useAuthentication ? password : undefined,
        })
    }

    return (
        <div>
            <Container>
                <form 
                    onSubmit={handleConnectObs}
                >
                    <Row>
                        <Col>
                            <h2>Conectar com o OBS</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputField 
                                label="Porta: "
                                value={port}
                                onChange={setPort}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputField 
                                type="password"
                                label="Senha: "
                                value={password}
                                onChange={setPassword}
                                disabled={!useAuthentication}
                            />
                        </Col>
                        <Col>
                            <Checkbox
                                label="Usar Autenticação"
                                value={useAuthentication}
                                onChange={setUseAuthentication}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <input
                            type="submit"
                            value="Conectar"
                        ></input>
                    </Row>
                </form>
            </Container>
        </div>
    )
}