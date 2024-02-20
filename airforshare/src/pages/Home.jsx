import React, { useState , useEffect } from 'react'
import "../style.scss"
import { GrTextAlignFull } from "react-icons/gr";
import { MdLibraryBooks } from "react-icons/md";
import {useDropzone} from 'react-dropzone'
import { useRef } from 'react';
import { TiArrowDownThick } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { TiHtml5 } from "react-icons/ti";
import { BsFiletypeCss } from "react-icons/bs";
import { IoLogoJavascript } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import { db,set,ref,onValue, remove , storage , uploadBytesResumable, getDownloadURL,storageRef } from '../firebase/Firebase';
import { Spin } from 'antd';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Logo from '../assets/airforsharelogo-removebg-preview.png'
import { IoMenuSharp } from "react-icons/io5";
import "../App.css"


const Home = () => {
  const [type,setType] = useState("text")// for moving text or file layout
  const [btn,setbtn] = useState("")
  const [text,settext] = useState(localStorage.getItem("textvalue") || "") // onchange function called and saved text value in this state and this condition also applied save and copy btn
  const [check,setcheck] = useState([])
  const [files,setfiles] = useState(JSON.parse(localStorage.getItem('files')) || []) //onchange function called and saved files data in this state
  const [seen,setSeen] = useState(false); 
  const [hamberg,sethamberg] = useState(true)// hamberg functionlity 


// ========textbtn on click showing text by changing state value condition applyed Below==============


  const textfunction = ()=>{
    setType("text")
    console.log("text");
  }

  // ========textbtn on click showing file by changing state value condition applyed Below==============


  const filefunction = ()=>{
    setType("file")
    console.log("file");
  }


  // ===========useref used by getting current Element==================


  let textref = useRef()


  // =======onchangefunction hs been called on textarea======================


  const textreffunc = (e) =>{
console.log(e.target.value);


// =====By local storage =========


localStorage.setItem("textvalue",e.target.value)// not commented beacause in state i applyed localstorage condition icant applied a code of firebase datastorage in state


// let storagedata = localStorage.getItem("textvalue")
// settext(storagedata)
// console.log(textref);


// ====================By firebase==================
// =====set data=============


set(ref(db, 'Sharing' ), {
  text:e.target.value
});


// =========getdata firebase============


const starCountRef = ref(db, 'Sharing')
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log("dbdata",data.text);
  settext(data.text)
});

  }   


// ========when you click on copy btn text copied ===============


const textcopyfunc = ()=>{

  navigator.clipboard.writeText(text)

}


// ============ when you clicked on deltall btn all fies will be removed================


  const deltAll = ()=>{
    localStorage.setItem('files', JSON.stringify([]));
    setfiles([])
    remove(ref(db, 'fileSharing'))

  }


    {/* ======== dropdowncode for file upload code from react dropzone/===================== */}


  const onDrop = acceptedFiles => {
    console.log(acceptedFiles[0],"acceptedFiles index");
    console.log(acceptedFiles,"acceptedFiles all");
for (let index = 0; index < acceptedFiles.length; index++) {
  console.log(acceptedFiles[index]);// for morethan one file uploaded
setSeen(true)
  console.log("one")
  uploadfiles(acceptedFiles[index],index,acceptedFiles)
  console.log("badmai");

}
   
    }

    // dowlnload files
    const downloadAll = ()=>{
      //here codes taken from jszip and filesaver from sirebasestorage download file
      
      // =======genaratezip===================

      let filename = "allfiles";
      // const file = files.map(data => data.imgurl)
      
      // files.map((data,ind)=>{
      //   console.log(ind)
      //   return data.imgurl
      // })
        const zip = new JSZip()
        const folder = zip.folder('project')
        files.forEach((file)=> {
       const blobPromise =  fetch(file.imgurl)    // here you give url public
    .then(function (response) {  
      console.log({response})             
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response.blob());
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    })                   

    const name = file.file.path
            folder.file(name, blobPromise)
        })
    
        zip.generateAsync({type:"blob"})
            .then(blob => saveAs(blob, filename))
            .catch(e => console.log(e));

    }

    // =====================uploadfiles from storage ===============


    const uploadfiles = (files,index,acceptedFiles) =>{
return new Promise((resolve, reject) => {
  
const fileref = storageRef(storage, `images/${index}`);

const uploadTask = uploadBytesResumable(fileref, files);//here  files get name of img coding jpg inside array data

uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("aaayoe");
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
    // console.log("error",error)
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL)
      console.log('File available at', downloadURL);//  genarate url
      setSeen(false)

// ============adding files==========================

// here file urls saved in local and firebase data base which we can used any where
// ==========localstorage==========================
  const saveditems = JSON.parse(localStorage.getItem('files')) || [];
  const buyitems = { 
    file:acceptedFiles[index],
    type:acceptedFiles[index].type,
    alldata:acceptedFiles,
    imgurl:downloadURL
  };
  saveditems.push(buyitems);
  localStorage.setItem('files', JSON.stringify(saveditems));
  setfiles(JSON.parse(localStorage.getItem('files')))


  // =========================firebasedatabase=========================


  let getfilesdatafromstorage =JSON.parse(localStorage.getItem('files'))

  set(ref(db, 'fileSharing' ), [...getfilesdatafromstorage]);

  const starCountRef = ref(db, 'fileSharing')
  onValue(starCountRef, (snapshot) => {
    let data = snapshot.val();
    console.log("dbdata",data);
    // setfiles(data) if you want to get data from firebase database to shown on whole system
  });
  // console.log(data)

    });
  }
);
})
    }
  

// ===============================clear btn on text file functionality===========


    const cleardata = ()=>{
      remove(ref(db, 'Sharing'))
      settext("")
      localStorage.setItem("textvalue","")
    }


    // =============================input files==========

// input file input dropzone code 
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


    {/* ======== dropdowncode for file/===================== */}


  return (


    <div className=' h-screen w-full flex flex-col  items-center'>
    <div className=' boxlogoandheader w-full flex justify-center h-1/6 items-center'>
<div className="logandheader flex items-center justify-between w-9/12 h-20 ">


{// airforshare logo and hamburg navbar
  hamberg?
  <div className=' flex w-full h-full justify-between items-center'>
  <div className="logo">
    <img src="https://airforshare.com/assets/img/logo.svg" alt="img" className=' min-[290px]:hidden lg:block airforsharelogo'/>
    <img src={Logo} alt="img" className=' min-[290px]:block lg:hidden h-full w-2/5 alogo'/>
    </div>
<div className=' w-7/12 h-4/6 text-right flex justify-end min-[290px]:block min-[291px]:flex min-[768px]:hidden   hamberg'>
  <IoMenuSharp className=' w-5/12 h-full text-right ' onClick={()=>sethamberg(false)}/>
  </div>

  </div>:
  ""
}


{// navbar items when width is small 
  hamberg?
  <div className="header justify-around w-full min-[290px]:hidden 
  min-[767px]:block  min-[768px]:justify-around min-[768px]:flex  navbaritem">

    <p className=' cursor-pointer ml-4 md:text-sm lg:text-base'>How it Works</p>
    <p className=' cursor-pointer ml-4'>Download</p>
    <p className=' cursor-pointer ml-4'>Upgrade</p>
    <p className=' cursor-pointer ml-4'>Feedback</p>
    <p className=' text-sky-600 cursor-pointer ml-4'>Login/Register</p>

  </div>:
  ""
}


 

</div>
    </div>

    {// when you click hamberg expander will shown

!hamberg?

<div className="flex items-center w-full flex-col  h-full  justify-around">

  <p className=' cursor-pointer '>How it Works</p>
  <p className=' cursor-pointer '>Download</p>
  <p className=' cursor-pointer '>Upgrade</p>
  <p className=' cursor-pointer '>Feedback</p>
  <p className=' text-sky-600 cursor-pointer '>Login/Register</p>
  <p className=' text-3xl font-bold' onClick={ ()=>sethamberg(true)}>X</p>

</div>:

"" 
}


    {/* =========================when state type === text file will be shown text not a dropfile page */}
{ // this is apply here for  display none when we click on humberg
  hamberg?
<div className=' w-full h-full'>
{
type === "text"?// text and file showing condition
    <div className=' w-full min-[290px]:block min-[768px]:hidden min-[291px]:flex justify-around items-center parenticon'>
<p className=' text-3xl font-bold m-3' >Text</p>

<div className=' icon flex'>

<p className=' mx-2 bg-white' onClick={textfunction}>
<GrTextAlignFull   className='  text-violet-600 text-3xl '/>
</p>

<p className='mx-2' onClick={filefunction}> <MdLibraryBooks className='  text-center  cursor-pointer text-3xl text-gray-400'/></p>
</div>
</div>:

<div className=' w-full min-[290px]:block min-[768px]:hidden min-[291px]:flex justify-around items-center parenticon'>
<p className=' text-3xl font-bold m-3' >File</p>

<div className=' icon flex'>

<p className=' mx-2 ' onClick={textfunction}>
<GrTextAlignFull   className='   text-3xl text-gray-400'/>
</p>

<p className='mx-2 bg-white text-violet-600' onClick={filefunction}> <MdLibraryBooks className='  text-center  cursor-pointer text-3xl'/></p>
</div>
</div>

}



{type === "text"?
    <div className=' bg-white w-11/12 h-4/6 flex min-[290px]:ml-3 min-[768px]:ml-5   
    min-[290px]:h-5/6'>


<div className="sidebar w-1/12 h-full min-[290px]:hidden min-[768px]:block">
<p className=' text-center flex justify-center h-1/6 items-center bg-white' onClick={textfunction}>
<GrTextAlignFull   className=' text-lg text-center text-violet-600 cursor-pointer h-3/6 w-full'/>
</p>
<p className=' text-center flex justify-center h-5/6 bg-gray-200' onClick={filefunction}> <MdLibraryBooks className='  text-center text-xs cursor-pointer bg-gray-200 h-10 w-full text-gray-400'/></p>
</div>




<div className="mainbar w-full">
  <p className=' text-5xl m-3 font-bold min-[290px]:hidden min-[768px]:block'>Text</p>
  <p className=' h-3/5 w-full ml-5 flex flex-col items-start justify-start align-text-top' >

    <textarea ref={textref} type="text" placeholder='Write Something' className=' h-full w-11/12 align-text-top outline-none cursor-pointer textarea resize-none overflow-scroll' onChange={textreffunc}
    value={text}/>

  </p> 

  <div className=' flex justify-end items-center w-11/12 ml-3 mb-3 pb-4 h-1/6'>

  {
  text.match(/\bhttps?:\/\/\S+\b/g)?
  <div className=' w-2/3 flex  overflow-scroll text-sm'>
  <a href={text} className=' flex  text-blue-600 overflow-y-hidden'>

{text}
    </a>
  </div>:
"" 
} 
  <button onClick={cleardata} className=' p-1 w-3/12 text-center mt-2 cursor-pointer mr-3' > clear
    </button>

    {
      !text?
     <button  className=' border-2 p-1 w-3/12 text-center font-bold text-2xl mt-2 cursor-pointer btn' > Save
    </button> :
    <button onClick={textcopyfunc} className=' border-2 p-1 w-3/12 text-center font-bold text-2xl mt-2 cursor-pointer btn' > Copy
    </button>
    }
    </div>
</div>
    </div>

    :

    <div className=' bg-white w-11/12 h-4/6 flex min-[290px]:ml-3 min-[768px]:ml-5 min-[290px]:h-5/6'>
<div className="sidebar w-1/12 h-full min-[290px]:hidden min-[768px]:block">
<p className=' text-center flex justify-center h-1/6 items-center bg-gray-200' onClick={textfunction}><GrTextAlignFull  className=' text-center text-xs text-gray-400  cursor-pointer h-3/6 w-full'/></p>
<p className=' text-center flex justify-center h-5/6 bg-gray-200' onClick={filefunction}> <MdLibraryBooks className='  text-center text-xs text-violet-600 cursor-pointer h-10 w-full bg-white'/></p>
</div>
<div className="mainbar w-full h-full">


{/* ===================files page ui/ux=============== */}


  <div className=' flex items-center justify-between mt-6 w-full'>
  <p className=' text-5xl ml-6 font-bold min-[290px]:hidden min-[768px]:block'>Files</p>
  <div className=' flex items-center justify-around w-full'>

  <p onClick={downloadAll} className=' flex items-center mr-2 cursor-pointer text-blue-600'><span> <TiArrowDownThick className='' /> </span> DownloadAll</p>

  <p className=' flex items-center mr-2  cursor-pointer text-red-950' onClick={deltAll}><span> <MdDeleteForever /> </span> DeleteAll</p>
  </div>
  </div>


  {/* ======== dropdowncode for file for uploading files/===================== */}


<div className=' w-full flex justify-center items-center h-5/6'>


  {/* ==================when not a file is added so this block will run============== */}


{
  files.length < 1 ?
  <div className=' w-full cursor-pointer border-2 p-2 h-4/6 border-dotted flex justify-center items-center' {...getRootProps()}>
  <input {...getInputProps()} />

  
   <p className=''>Drag and drop any files up to 2 files, 5Mbs each or <span className=' text-blue-500'>Browse
   Upgrade</span>  to get more space  
   { 
   seen?
   <Spin  className=''/>:
   ""
  }
   </p> 
  
</div>


// ==================== when files has been added this block will shown====================


:

<div className='addedandcreatefiles w-full h-full'>
  
<div className=' addedfiles mt-12 flex w-full'>
  
<div className=' w-7/12 flex flex-wrap ml-3'>

  {/* =======================this files state data has been recieved from local storage and shown in ui through map function by switching condition to show image icon==================== */}

{
files.map((data,ind)=>{
let icon;
switch (data.type){
case "image/jpeg":
  icon = <img src={data.imgurl} className=' h-full w-full'/>
  break;
  case "text/css":
  icon = <BsFiletypeCss className=' h-full w-full'/>
  break;
  case "text/html":
  icon = <TiHtml5 className=' h-full w-full'/>
  break;
  case "text/javascript":
  icon = <IoLogoJavascript className=' h-full w-full' />
  break;
  case "image/jpg":
  icon = <img src={data.imgurl} className=' h-full w-full'/>
  break;
  case "image/png":
  icon =<img src={data.imgurl} className=' h-full w-full' />
  break;
  case "application/pdf":
    icon = < FaFilePdf className=' h-full w-full'/>
    break;

  default:
    icon = < CiFileOn className=' h-full w-full'/>
}

  return (
    
<div key={ind} className=' w-1/2 flex flex-col items-center mb-4'>
{/* <div className=' text-3xl'/> */}
<p className=' text-3xl ml-3 text-center h-18 w-18'>
<a href={icon} download={icon}>

  {icon}
  </a>
  </p>
<p className=' text-center'>
 

{data.file.path.substring(0,5)}{data.file.path.substring(data.file.path.length -5)}
</p>

</div>  
)
})
}
</div>


<div  className=' w-5/12 mr-2 h-full' {...getRootProps()}>
      <input {...getInputProps()} />
      {
        <div className=' border-dotted border-2 ml-3 flex flex-col justify-center items-center p-2 cursor-pointer w-full h-full'>
        <IoIosAdd />
        <p className=' text-sm'>Add File</p>
        <p className=' text-xs'>(Upto 5 MB) </p>
        { 
   seen?
   <Spin  className=' text-lg p-2 w-full h-full'/>:
   ""
  }
       


      
        </div>
        
      }
    </div>
</div>

    </div>

}
    </div>
</div>
    </div>
    
}
</div>:
""
}
    </div>
  )
}

export default Home