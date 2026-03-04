import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';

function Discussions() {
    const [messgData, setMessgData] = useState([]);
    const [currMessage, setCurrMessage] = useState("");
    const currUserName = localStorage.getItem('email') ? localStorage.getItem('email').slice(0,6) : "Guest";
    const [isReplying, setIsReplying] = useState(false);
    const [replyingTo, setReplyingTo] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/fetchMessages`)
            .then(res => res.json())
            .then(data => setMessgData(data))
            .catch(err => console.log("Error: ", err))
    }, [])

    const handleSendMessage = () => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        let timeStamp = hours + ":" + minutes;
        const msg_id = Math.round(Math.random() * 100000000000000);
        if (isReplying === true) {
            setMessgData(prev => ([
                ...prev,
                {
                    msg_id: msg_id,
                    referedTo: replyingTo,
                    username: currUserName,
                    message: currMessage,
                    timestamp: timeStamp,
                }
            ]));
            fetch(`${process.env.REACT_APP_BACKEND_URL}/sendMessages`, {
                method: "POST",
                headers: { 'Content-type': 'Application/json' },
                body: JSON.stringify({ msg_id, referedTo: replyingTo, username: currUserName, message: currMessage, timestamp: timeStamp })
            })
                .then((res) => res.json())
                .catch((err) => console.log("Error: ", err));
            setReplyingTo("");
            setIsReplying(false);
        } else {
            setMessgData(prev => ([
                ...prev,
                {
                    msg_id: msg_id,
                    referedTo: "",
                    username: currUserName,
                    message: currMessage,
                    timestamp: timeStamp,
                }
            ]));
            fetch(`${process.env.REACT_APP_BACKEND_URL}/sendMessages`, {
                method: "POST",
                headers: { 'Content-type': 'Application/json' },
                body: JSON.stringify({ msg_id, referedTo: "", username: currUserName, message: currMessage, timestamp: timeStamp })
            })
                .then((res) => res.json())
                .catch((err) => console.log("Error: ", err));
        }
        setCurrMessage("");
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', px: 4, py: 6 }}>
            {messgData.length === 0 && <Typography variant="h4">Loading....</Typography>}
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto', mb: 2 }}>
                <Stack spacing={2}>
                    {messgData && messgData.map((messg) => {
                        if (messg.referedTo && messg.referedTo.length > 0) {
                            const refered_mssg = messgData.find(
                                (mssg) => mssg.msg_id === messg.referedTo
                            );
                            return (
                                <Box key={Math.random()}>
                                    {refered_mssg && (
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <Typography variant="body2">↓ ←</Typography>
                                            <Chip label={refered_mssg.username} color="error" size="small" />
                                            <Chip label={refered_mssg.message} color="primary" size="small" sx={{ maxWidth: 400 }} />
                                            <Chip label={refered_mssg.timestamp} size="small" />
                                        </Stack>
                                    )}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip label={messg.username} size="small" />
                                        <Chip label={messg.message} size="small" sx={{ maxWidth: 400 }} />
                                        <Chip label={messg.timestamp} size="small" />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                setIsReplying(true);
                                                setReplyingTo(messg.msg_id);
                                            }}
                                        >Reply</Button>
                                    </Stack>
                                </Box>
                            );
                        }
                        return (
                            <Box key={Math.random()}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label={messg.username} size="small" />
                                    <Chip label={messg.message} size="small" sx={{ maxWidth: 400 }} />
                                    <Chip label={messg.timestamp} size="small" />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setIsReplying(true);
                                            setReplyingTo(messg.msg_id);
                                        }}
                                    >Reply</Button>
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>
            </Box>
            {isReplying === true && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip label={`Replying to ${replyingTo} message`} color="info" />
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setIsReplying(false);
                            setReplyingTo(0);
                        }}
                    >Cancel</Button>
                </Stack>
            )}
            <Stack direction="row" spacing={1} alignItems="center">
                <Input
                    value={currMessage}
                    onChange={(e) => setCurrMessage(e.target.value)}
                    size="small"
                    placeholder="message"
                    sx={{ width: '70%' }}
                />
                <Button
                    variant="contained"
                    sx={{ width: '10%' }}
                    onClick={() => {
                        if (currMessage.trim() === "") {
                            window.alert("Enter message..!");
                        } else {
                            handleSendMessage();
                        }
                    }}
                >Send</Button>
            </Stack>
        </Box>
    );
}

export default Discussions;