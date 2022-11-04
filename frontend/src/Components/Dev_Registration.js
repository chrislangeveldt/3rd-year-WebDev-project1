import React from 'react'
import './CSS/DevRegCSS.css'
import Swal from 'sweetalert2'


const ImgUpload = ({
    onChange,
    src
}) =>
    <label htmlFor="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload" >
            <img htmlFor="photo-upload" src={src} alt="profile" />
        </div>
        <input id="photo-upload" type="file" onChange={onChange} />
    </label>


const FullName = ({
    onChange,
    value
}) =>
    <div className="field">
        <label htmlFor="name">
            Full Name:
        </label>
        <input
            id="name"
            type="text"
            onChange={onChange}
            maxLength="25"
            value={value}
            placeholder="Alexa"
            required />
    </div>

const Email = ({
    onChange,
    value
}) =>
    <div className="field">
        <label htmlFor="email">
            Email:
        </label>
        <input
            id="email"
            type="email"
            onChange={onChange}
            maxLength="25"
            value={value}
            placeholder="jbloggs@mail.com"
            required />
    </div>

const Password = ({
    onChange,
    value
}) =>
    <div className="field">
        <label htmlFor="password">
            Password:
        </label>
        <input
            id="password"
            type="password"
            onChange={onChange}
            maxLength="25"
            value={value}
            placeholder="password"
            required />
    </div>

const ScaleJava = ({
    onChange,
    value
}) =>
    <div className="field" onChange={onChange} value={value}>

        <label htmlFor="scale">Programming Experience in JavaScript:</label>
        <ul className='likert' >
            <li>
                <input type="radio" name="likertJava" value="None" />
                <label className="statement" >None</label>
            </li>
            <li>
                <input type="radio" name="likertJava" value="Beginner" />
                <label className="statement">Beginner</label>
            </li>
            <li>
                <input type="radio" name="likertJava" value="Intermediate" />
                <label className="statement">Intermediate</label>
            </li>
            <li>
                <input type="radio" name="likertJava" value="Advanced" />
                <label className="statement">Advanced</label>
            </li>
        </ul>
    </div>

const ScalePython = ({
    onChange,
    value
}) => <div className="field" onChange={onChange} value={value} >
        <label htmlFor="scale">Programming Experience in Python:</label>
        <ul className='likert' >
            <li>
                <input type="radio" name="likertPython" value="None" />
                <label className="statement" >None</label>
            </li>
            <li>
                <input type="radio" name="likertPython" value="Beginner" />
                <label className="statement">Beginner</label>
            </li>
            <li>
                <input type="radio" name="likertPython" value="Intermediate" />
                <label className="statement">Intermediate</label>
            </li>
            <li>
                <input type="radio" name="likertPython" value="Advanced" />
                <label className="statement">Advanced</label>
            </li>
        </ul>
    </div>

const ScaleC = ({
    onChange,
    value
}) =>
    <div className="field" onChange={onChange} value={value}>
        <label htmlFor="scale">Programming Experience in C/C++:</label>
        <ul className='likert' >
            <li>
                <input type="radio" name="likertC" value="None" />
                <label className="statement" >None</label>
            </li>
            <li>
                <input type="radio" name="likertC" value="Beginner" />
                <label className="statement">Beginner</label>
            </li>
            <li>
                <input type="radio" name="likertC" value="Intermediate" />
                <label className="statement">Intermediate</label>
            </li>
            <li>
                <input type="radio" name="likertC" value="Advanced" />
                <label className="statement">Advanced</label>
            </li>
        </ul>
    </div>

const ScaleGo = ({
    onChange,
    value,
}) =>
    <div className="field" onChange={onChange} value={value} >
        <label htmlFor="scale">Programming Experience in Go:</label>
        <ul className='likert' >
            <li>
                <input type="radio" name="likertGo" value="None" />
                <label className="statement" >None</label>
            </li>
            <li>
                <input type="radio" name="likertGo" value="Beginner" />
                <label className="statement">Beginner</label>
            </li>
            <li>
                <input type="radio" name="likertGo" value="Intermediate" />
                <label className="statement">Intermediate</label>
            </li>
            <li>
                <input type="radio" name="likertGo" value="Advanced" />
                <label className="statement">Advanced</label>
            </li>
        </ul>

    </div>

    const handleHome = (e) => {
        e.preventDefault();
        window.location.pathname = "/login";
    };

const Profile = ({
    onSubmit,
    src,
    name,
    email,
    scaleJava,
    scalePython,
    scaleC,
    scaleGo,
}) =>
    <div className="card">
        <form onSubmit={onSubmit}>
            <h1>Successfully Registered</h1>
            <label className="custom-file-upload fas">
                <div className="img-wrap" >
                    <img for="photo-upload" src={src} alt="Upload" />
                </div>
            </label>
            <div className="name">{name}</div>
            <div className="email">{email}</div>
            <div className="scale">JavaScript - {scaleJava}</div>
            <div className="scale">Python - {scalePython}</div>
            <div className="scale">C/C++ - {scaleC}</div>
            <div className="scale">Go - {scaleGo}</div>
            <button type="submit" className="styleBtn edit">Edit Details </button>
            
        </form>
    </div>

const Edit = ({
    onSubmit,
    children,
}) =>
    <div className="card">
        <form onSubmit={onSubmit}>
            <h1>Developer Registration</h1>
            {children}
            <button type="submit" className="styleBtn save">Save </button>
            <button className="btn" onClick={handleHome}> Back </button>
        </form>
    </div>

class DevReg extends React.Component {
    state = {
        file: '',
        imagePreviewUrl: 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true',
        name: '',
        email: '',
        password: '',
        scaleJava: 'None',
        scalePython: 'None',
        scaleC: 'None',
        scaleGo: 'None',
        active: 'edit'
    }

    photoUpload = e => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(file);
    }
    editName = e => {
        const name = e.target.value;
        this.setState({
            name,
        });
    }

    editEmail = e => {
        const email = e.target.value;
        this.setState({
            email,
        });
    }

    editPassword = e => {
        const password = e.target.value;
        this.setState({
            password,
        });
    }

    editScaleJava = e => {
        const scaleJava = e.target.value;
        this.setState({
            scaleJava,
        });
    }

    editScalePython = e => {
        const scalePython = e.target.value;
        this.setState({
            scalePython,
        });
    }

    editScaleC = e => {
        const scaleC = e.target.value;
        this.setState({
            scaleC,
        });
    }

    editScaleGo = e => {
        const scaleGo = e.target.value;
        this.setState({
            scaleGo,
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        let data = this.state;
        const requestOpt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'name': data.name,
                'password': data.password,
                'email': data.email,
                'scaleJava': data.scaleJava,
                'scalePython': data.scalePython,
                'scaleC': data.scaleC,
                'scaleGo': data.scaleGo,
                'open_to_contracts':document.getElementById('openCheckbox').checked
            }),
        }

        async function fetchFunc() {
            return await fetch('http://127.0.0.1:5000/devReg', requestOpt)
            .then(response => response.json())
            .catch(error => console.log(error));
        }
        (async () => {
            let info = await fetchFunc();
            if (info.success) { 
                window.location.pathname = "/login";
            } else {
                Swal.fire(
                    info.msg,
                    'Try again!',
                    'warning',
                  )
            }
        })()
    }

    render() {
        const { imagePreviewUrl,
            name,
            email,
            password,
            scaleJava,
            scalePython,
            scaleC,
            scaleGo,
            active } = this.state;
        return (
            <div>

                {(active === 'edit') ? (
                    <Edit onSubmit={this.handleSubmit}>
                        <ImgUpload onChange={this.photoUpload} src={imagePreviewUrl} />
                        <FullName onChange={this.editName} value={name} />
                        <Email onChange={this.editEmail} value={email} />
                        <Password onChange={this.editPassword} value={password} />
                        <ScaleJava onChange={this.editScaleJava} value={scaleJava} />
                        <ScalePython onChange={this.editScalePython} value={scalePython} />
                        <ScaleC onChange={this.editScaleC} value={scaleC} />
                        <ScaleGo onChange={this.editScaleGo} value={scaleGo} />
                        <div>
                            <label>Open to contracts:</label>
                            <input type="checkbox" id="openCheckbox"/>
                        </div>
                    </Edit>
                ) : (
                    <Profile
                        onSubmit={this.handleSubmit}
                        src={imagePreviewUrl}
                        name={name}
                        email={email}
                        password={password}
                        scaleJava={scaleJava}
                        scalePython={scalePython}
                        scaleC={scaleC}
                        scaleGo={scaleGo}
                    />)}
            </div>
        )
    }

}

// ReactDOM.render(
//     <>
//         <DevReg />
//     </>
//     ,
//     document.getElementById('root')
// )

export default DevReg;
