import React from "react"
import Container from "@material-ui/core/Container";
import {courses} from "../../GlobalVar";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";

import axios from "axios"

const useStyle = makeStyles({
    buttonProgress: {
        color: "orangered",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

const Lesson = () => {
    const classes = useStyle()

    const [course, setCourse] = React.useState(0);
    const [loadingLessons, setLoadingLessons] = React.useState(false);

    const handleChangeCourse = event =>{
        setCourse(event.target.value)
        console.log(event.target.value)

        setLoadingLessons(true)

        axios.get("http://localhost:80/api/lesson/getLessonsName/" + event.target.value).then(response =>{
            console.log(response.data)
            setLoadingLessons(false)
            }
        ).catch(error => {
            console.log(error)
            setLoadingLessons(false)
        })
    }

    return(
        <Container>
            <form autoComplete="on" noValidate style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
                <TextField
                    id="standard-select-currency"
                    select
                    label="Course"
                    value={course}
                    onChange={handleChangeCourse}
                    helperText="Please select your course"
                    disabled={loadingLessons}
                >
                    {courses.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}

                </TextField>
                {loadingLessons && <CircularProgress  size={24} className={classes.buttonProgress} />}
            </form>
        </Container>
    )
}

export default Lesson