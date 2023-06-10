import Image from "next/image";
import { useState } from "react";

function imageAi() {
  const[image, setImage] = useState();
  const[loading, setLoading] = useState(false);

  const generate = async (prompt?: string) => {
    const response = await fetch('/api/generate-image',{
      method: 'Post',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          prompt: prompt
      })
    }).then((response) => response.json());

    console.log(response.image)
    setImage(response.image)
  };
  function getRandomInt(max:number) {
    return Math.floor(Math.random() * max);
  }

  const colors = ["Red","Orange","Green","Blue","Purple","Black","Yellow","Aqua"];
  const color = colors[getRandomInt(7)];
  const groupName = 'Fleet'
  const customPrompt = `For my ${groupName} web3 freelance collective, a cartoon bee hive with ${color} background`;


  return (
    <>
      <h1>Image AI</h1>
      <img width='431' height='431' src={image} alt='' /> 

      <button
        onClick={() => generate()}
        className="p-2 rounded-md text-gray-500 bottom-1.5 roght-1"
        >
        <p>Generate Random</p>

        </button>

        <button
        onClick={() => generate(customPrompt)}
        className="p-2 rounded-md text-gray-500 bottom-3.5 roght-1"
        >
        <p>Generate Custom</p>

        </button>
    </>
  );
}

export default imageAi;
