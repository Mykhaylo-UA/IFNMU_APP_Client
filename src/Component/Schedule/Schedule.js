import React from "react"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from "@material-ui/core/CircularProgress"
import axios from "axios"

import {courses, facultyes, scheduleTypes, dates, weekTypes} from "../../GlobalVar"

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
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
    tableCell:{
        padding: 2,
    }
  });

const Schedule = () => {
    const classes = useStyles();

    const [course, setCourse] = React.useState(0);
    const [faculty, setFaculty] = React.useState(0);
    const [loadStatus, setLoadStatus] = React.useState(false)
    const [scheduleType, setScheduleType] = React.useState(0);
    const [weekType, setWeekType] = React.useState(0);
    const [date, setDate] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [datesTable, setDatesTable] = React.useState([])
    const [addOrEdit, setAddOrEdit] = React.useState(true)
    const [requestStatus, setRequestStatus] = React.useState(false)

    const [lessons, setLessons] = React.useState([["","","","","",""]])

    const handleChange = (event) => {
        setCourse(event.target.value);
      };

    const handleChangeFaculty = (event) => {
        setFaculty(event.target.value);
        setLoadStatus(false)
    };
    const handleChangeWeekType = event =>{
        setWeekType(event.target.value)
        setLoadStatus(false)
    }

    const handleClickLoad = () =>{
        setLoading(true);

        const response = axios.get(
            "http://localhost:80/api/schedule/getschedule?course=" + course +(date === 0 ? "" : "&date="+date)+"&faculty="+faculty+"&scheduleType="+scheduleType+"&weekType="+weekType

        ).then(response =>{
            if(response.status === 200){
                setLoading(false);
                setLoadStatus(true);
                console.log(response.data)

                if(response.data.length <= 0){
                    console.log(response.data.length)
                    setAddOrEdit(true);
                    if(scheduleType === 0){
                        setLessons([["",
                            "","","","",
                            "","","","",
                            "","","","",
                            "","","","",
                            "","","","",]]);
                    }
                    else{
                        setLessons([["","","","","",""]]);
                    }
                }
                else {
                    setAddOrEdit(false)
                    setLessons("else",response.data)
                    console.log(response.data)
                };

                let dat = []

                for(let a=0; a < 5; a++){
                    let d = new Date (Date.parse(date));
                    d.setDate(d.getDate() + a);
                    dat.push(d);
                }
                setDatesTable(dat);
            }
        });

    }
    
    const handleClickAddRow = () =>{
        if(scheduleType === 0 ){
            setLessons([...lessons, ["",
            "","","","",
            "","","","",
            "","","","",
            "","","","",
            "","","","",]])
        }
        else{
            setLessons([...lessons, ["","","","","",""]])
        }
    }
    const handleClickSave = async () => {
        if(addOrEdit){
            setRequestStatus(true)
            const response = await axios.post(
                "http://localhost:80/api/schedule?course=" + course +(date === 0 ? "" : "&date="+date)+"&lectionInfo=В - 10б, 10"+"&scheduleType="+scheduleType+"&weekType="+weekType,
                lessons
            ).then(response => {
                if(response.status === 200){
                    setRequestStatus(false)
                }
            }).catch(error=> console.log(error));
                
        }
        else{
            const response = await axios.put(
                "http://localhost:80/api/schedule?course=" + course +"&faculty="+faculty+"&date="+date+"&lectionInfo=В - 10б, 10",
                lessons
            );
            console.log(response);
        }

    }
    const handleChangeScheduleType = event =>{
        setScheduleType(event.target.value)
        setLoadStatus(false)
    }
    const handleChangeDate = event =>{
        setDate(event.target.value)
        setLoadStatus(false)
    }

    const handleChangeInputLesson = (event, index1, index2) =>{
        const les = [...lessons];
        les[index1][index2] = event.target.value;
        setLessons(les)
    }


    return(
        <Container>
            <form autoComplete="on" noValidate style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
                <TextField
                    id="type-schedule"
                    select
                    label="Schedule type"
                    value={scheduleType}
                    onChange={handleChangeScheduleType}
                    helperText="Please select schedule type"
                    >
                    {scheduleTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="standard-select-currency"
                    select
                    label="Course"
                    value={course}
                    onChange={handleChange}
                    helperText="Please select your course"
                    >
                    {courses.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="standard-select-currency"
                    select
                    label="Faculty"
                    value={faculty}
                    onChange={handleChangeFaculty}
                    helperText="Please select your faculty"
                    >
                    {facultyes.map((option) => (
                        <MenuItem key={option.value+100} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                {scheduleType === 1 ? 
                <TextField
                    id="date"
                    select
                    label="Date"
                    value={date}
                    onChange={handleChangeDate}
                    helperText="Please select date week"
                    >
                    {dates.map((option) => (
                        <MenuItem key={option.value+100} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField> :
                <TextField
                    id="weekType"
                    select
                    label="Type week"
                    value={weekType}
                    onChange={handleChangeWeekType}
                    helperText="Please select type week"
                    >
                    {weekTypes.map((option) => (
                        <MenuItem key={option.value+100} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                }
                
                <Button color="primary" size="medium" disabled={loading} variant="contained" onClick={handleClickLoad}>Load{loading && <CircularProgress  size={24} className={classes.buttonProgress} />}</Button>

            </form>

            {loadStatus ?
                <TableContainer className={classes.tableContainer} component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                                {scheduleType === 0 ? 
                                    <React.Fragment>
                                        <TableRow>
                                            <TableCell rowSpan={2} align="center">Name lesson</TableCell>
                                            <TableCell colSpan={4} align="center">Monday</TableCell>
                                            <TableCell colSpan={4} align="center">Thuesday</TableCell>
                                            <TableCell colSpan={4} align="center">Wednesday</TableCell>
                                            <TableCell colSpan={4} align="center">Thursday</TableCell>
                                            <TableCell colSpan={4} align="center">Friday</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell align="center">2</TableCell>
                                            <TableCell align="center">3</TableCell>
                                            <TableCell align="center">4</TableCell>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell align="center">2</TableCell>
                                            <TableCell align="center">3</TableCell>
                                            <TableCell align="center">4</TableCell>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell align="center">2</TableCell>
                                            <TableCell align="center">3</TableCell>
                                            <TableCell align="center">4</TableCell>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell align="center">2</TableCell>
                                            <TableCell align="center">3</TableCell>
                                            <TableCell align="center">4</TableCell>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell align="center">2</TableCell>
                                            <TableCell align="center">3</TableCell>
                                            <TableCell align="center">4</TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                    :
                                    <TableRow>
                                        <TableCell aling="center">Name lesson</TableCell>
                                        
                                        {datesTable.map(date=>(
                                            <TableCell align="center">{date.toLocaleDateString()}</TableCell>
                                        ) )}
                                    </TableRow>   
                                
                                }

                        </TableHead>
                        <TableBody>
                                    {lessons.map((option, index) =>  (
                                        <TableRow key={index}>
                                            {
                                                option.map((o, index2) => (
                                                    <TableCell style={scheduleType === 0 ? {padding: 2}  : null} key={index2+100} component="th" scope="row">
                                                        <TextField 
                                                            onBlur ={event=>handleChangeInputLesson(event, index, index2)}
                                                            >

                                                        </TextField>
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                    <div className={classes.footer}>
                        <Button color="primary" size="medium" variant="contained" onClick={handleClickAddRow}>Add Row</Button>
                        <Button color="primary" size="medium" variant="contained" onClick={handleClickSave}>{addOrEdit ? "Add" : "Edit"}</Button>
                    </div>
                </TableContainer>
            : null}


            {requestStatus && <CircularProgress  size={50} className={classes.progressRequest} />}
        </Container>
    )
}

export default Schedule