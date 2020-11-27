import React, {useEffect} from "react"
import Container from "@material-ui/core/Container"
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {useHistory} from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 1000
    },
    tableContainer:{
        marginTop: 20
    },
    footer:{
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 5px"
    },
    buttonProgress: {
        color: "orangered",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
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
}));


const Chair = () =>{
    const classes = useStyles();
    const history = useHistory();

    const [name, setName] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [requestStatus, setRequestStatus] = React.useState(true)
    const [tableData, setTableData] = React.useState([])

    const handleChangeName =  event =>{
        setName(event.target.value)
    }

    useEffect(()=>{
        axios.get("http://localhost:80/api/chair").then(response  =>{
            if(response.status === 200){

                setRequestStatus(false)

                setTableData(response.data);
            }
        }).catch(error=> console.log(error));
    }, [])

    const handleClickLoad =  () => {
        setLoading(true);

        axios.post("http://localhost:80/api/chair", {name: name}).then(response =>{
            if(response.status === 200){
                setTableData(tableData.concat(response.data));
            }
            setLoading(false)
            setName("")
        });

    }

    return (
        <Container>
            <form autoComplete="on" noValidate style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
                <TextField
                    id="outlined-basic"
                    label="Name"
                    value={name}
                    onChange={handleChangeName}
                    helperText="Please input name chair"
                />
                <Button color="primary" size="medium" disabled={loading} variant="contained" onClick={handleClickLoad}>Add{loading && <CircularProgress  size={24} className={classes.buttonProgress} />}</Button>
            </form>

            {requestStatus === false ?
                <List component="nav" className={classes.root} aria-label="mailbox folders">
                        {tableData.map((option, index) => (
                            <ListItem button key={index} onClick={()=>history.push("/documents/"+option.id)}>
                                <ListItemText
                                    primary={option.name}
                                />
                            </ListItem>
                        ))}
                </List>
                : null}


            {requestStatus && <CircularProgress  size={50} className={classes.progressRequest} />}

        </Container>
    )
}

export default Chair