import React from 'react'
import TextField from "@material-ui/core/TextField"
import Container from "@material-ui/core/Container"
import MenuItem from "@material-ui/core/MenuItem"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Button from "@material-ui/core/Button"
import Paper from '@material-ui/core/Paper';
import CircularProgress from "@material-ui/core/CircularProgress"
import axios from "axios"

import {courses, dates, weekTypes, scheduleTypes} from "../../GlobalVar"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
      fontSize: "1.3em"
    },
    tableContainer:{
        marginTop: 20
    },
    footer:{
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 5px"
    },
    thNumber:{
        width: "10%"
    },
    thTime:{
        width: "20%"
    },
    thDay:{
        width: "100%",
        textAlign: "center"
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
    }
  });


const getDay = day =>{
    switch(day){
        case 0: return "Понеділок"
        case 1: return "Вівторок"
        case 2: return "Середа"
        case 3: return "Четвер"
        case 4: return "П`ятниця"
        case 5: return "Субота"
        case 6: return "Неділя"
        default: return "None"
    }
}

const Home = () =>{
    const [course, setCourse] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState(0);
    const [group, setGroup] = React.useState("");

    const [scheduleType, setScheduleType] = React.useState(0)
    const [weekType, setWeekType] = React.useState(0)

    const [schedule, setSchedule] = React.useState(null)

    const classes = useStyles();

    const handleChange = (event) => {
        setCourse(event.target.value);
      };
    const handleChangeGroup = event => {
        setGroup(event.target.value)
      }
    const handleChangeDate = event =>{
        setDate(event.target.value)
      }
    const handleChangeWeekType = event =>{
        setWeekType(event.target.value)
    }
    const handleChangeScheduleType = event =>{
        setScheduleType(event.target.value)
    }

    const handleClickLoad = async () =>{
        setLoading(true);
        const response = await axios.get(
            "http://localhost:80/api/schedule/getschedulegroup?course=" + course +(scheduleType===1? "&date="+date : "&weekType"+weekType)+"&group="+group
        );

        if(response.status === 200){
            setLoading(false);

            console.log(response.data)
            setSchedule(response.data)
        }
    }


    return(
        <Container>
            <form autoComplete="on" noValidate style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
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
                id="outlined-basic" 
                label="Group" 
                value={group} 
                onChange={handleChangeGroup}
                helperText="Please input your group"
                />

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

            {schedule != null ? ( !loading && <TableContainer className={classes.tableContainer} component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableBody>

                            {schedule[0].weeks.map((option, index) =>(
                                <React.Fragment>
                                    <TableRow key={index}>
                                        <TableCell colSpan={3} align="center" className={classes.thDay}>
                                            {getDay(index) + (option.date !== null ? " | " + new Date(option.date).toLocaleDateString() : null)}
                                        </TableCell>
                                    </TableRow>

                                    {option.lessons.map((opt, index)=>(
                                        <TableRow key={index+1000}>
                                            <TableCell align="center" className={classes.thNumber}>
                                                {opt.number}
                                            </TableCell>
                                            <TableCell>
                                                {opt.name}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>) : null
            }

        </Container>
    )
}

export default Home