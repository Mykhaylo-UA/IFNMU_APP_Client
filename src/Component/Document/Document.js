import React, {useEffect, useRef, useState} from "react"
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {useParams} from "react-router-dom"
import axios from 'axios'
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    progressRequest:{
        position: "absolute",
        color: "orangered",
        top: '50%',
        left: '50%',
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginTop: 30
    },
    buttonProgress: {
        color: "orangered",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));


const Document = () => {
    const {id} = useParams();
    const classes = useStyles();

    const [requestStatus, setRequestStatus] = useState(true);
    const [chair, setChair] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = React.useState(false)

    const fileInput = useRef(null)

    useEffect(()=>{
        setRequestStatus(true)

        axios.get("http://localhost:80/api/chair/"+id).then(response =>{

            setChair(response.data)
            setRequestStatus(false)
        })
    }, [id])

    const handleChangeName = event =>{
        setName(event.target.value)
    }

    const handleClickLoad = () =>{
        setLoading(true)

        var formData = new FormData();
        formData.append("uploadedFile", fileInput.current.files[0]);

        axios.post("http://localhost:80/api/document?name="+name+"&chairId="+id,
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }}
            ).then(response =>{
                let chairNew = [...chair]

                chairNew.documents = chairNew.documents.concat(response.data)

            setChair(chairNew)

            setLoading(false)
        })
    }

    return (
        <Container>
            {requestStatus === false ?
                <React.Fragment>
                    <Typography>{chair.name}</Typography>
                    <List component="nav" className={classes.root} aria-label="mailbox folders">
                        {chair.documents.map((option, index) => (
                            <ListItem button key={index}>
                                <ListItemText
                                    primary={option.name}
                                />
                            </ListItem>
                        ))}
                        <ListItem style={{display: "flex", justifyContent: "space-around", alignItems:"center"}}>
                            <TextField
                                style={{width: "40%"}}
                                label="Name"
                                value={name}
                                onChange={handleChangeName}
                            />
                            <TextField
                                style={{width: "40%"}}
                                type={"file"}
                                label={"File"}
                                inputRef={fileInput}
                            />
                            <Button color="primary" size={"small"} disabled={loading} variant="contained" onClick={handleClickLoad}>Add{loading && <CircularProgress  size={24} className={classes.buttonProgress} />}</Button>
                        </ListItem>
                    </List>
                </React.Fragment>

                : <CircularProgress  size={50} className={classes.progressRequest} />}
        </Container>
    )
}

export default Document