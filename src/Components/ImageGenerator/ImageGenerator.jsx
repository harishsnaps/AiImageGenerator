import React, { useRef, useState } from 'react'
import './ImageGenerator.css'
import default_image from '../Assets/default_image.svg'



function ImageGenerator() {

    const [image_url,setImage_url] = useState("/");
    const [loading,setLoading] = useState(false);
    let inputRef = useRef(null);

    const imageGenerator = async () => {
        if(inputRef.current.value===""){
            alert("Enter a Description");
            return;
        }
        const token = "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";
        setLoading(true);
        try {
            const response = await fetch (
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:
                        `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        inputs: inputRef.current.value,
                        options: {
                            wait_for_model:true
                        }
                    }),
                }
            );
            console.log("API Response", response);

            if(!response.ok){
                const errorResponse = await response.json();
                console.error("Error Response:",errorResponse);
                throw new Error (`HTTP error! status: ${response.status}, message:$ {errorResponse.error}`)
            }
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);

            console.log("Object URL:",objectURL);
            setImage_url(objectURL);
        } catch (error) {
            console.error("Error generating image:", error);
            alert(`Failed to generate image. Error:${error.message}`);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className='ai-image-generator'>
            <div className='header'>Ai image <span> generator</span></div>
            <div className='img-loading'>
                <div className='image'> <img src={image_url==="/"?default_image:image_url} alt=''/></div>
                <div className="loading">
                    <div className={loading?'loading-bar-full':"loading-bar"}></div>
                    <div className={loading?'loading-text':"display-none"}>Loading....</div>
                </div>
            </div>
            <div className='search-box'>
                <input type='text' ref={inputRef} className='search-input' placeholder='Describe what you want to create'/>
                <div className='generate-btn' onClick={imageGenerator}>
                    Generate
                </div>
            </div>
        </div>
    )
}

export default ImageGenerator
