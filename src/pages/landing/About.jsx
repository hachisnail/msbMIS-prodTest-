import React from 'react'
import LandingNav from '../../components/navbar/LandingNav'
import { ScrollRestoration } from 'react-router-dom'
import { useState, useEffect  } from 'react';

import curatorAbel from '../../../src/assets/IMG_2751_pp_JPG 1 (1).png';
import curatorKatherine from '../../../src/assets/IMG_2751_pp_JPG 2.png';
import curatorAndrew from '../../../src/assets/IMG_E2784_pp_JPG 1.png';
import curatorGlenda from '../../../src/assets/image 41.png';
import curatorJeah from '../../../src/assets/image 42.png';
import curatorVanessa from '../../../src/assets/image 43.png';
import curatorMhiles from '../../../src/assets/image 44.png';
import curatorAndrea from '../../../src/assets/image 45.png';
import curatorToto from '../../../src/assets/image 46.png';
import curatorLeni from '../../../src/assets/image 47.png';
import curatorAndex from '../../../src/assets/image 48.png';
import museumBackground from '../../../src/assets/440832115_947772303495782_6010038099693171993_n.png';
import museumImage1 from '../../../src/assets/Bulawan-Museum-14 1.png';
import museumImage2 from '../../../src/assets/455363415_812761527719886_1195461782753847821_n.png';
import museumExhibit from '../../../src/assets/456513150_820321936963845_2439220914474688907_n 1.png';
import visionBackground from '../../../src/assets/8900f8_0ff4146c815c45f78852a9574ae753d8~mv2 1.png';
import curatorMessage from '../../../src/assets/467396235_122120510066524881_2018490976163991958_n 2.png';
import keyPeopleHeader from '../../../src/assets/8900f8_517f4f9ec7054b88a23b301bf31d6596~mv2 1.png';


const curatorProfiles = [
  {
    name: "Abel C. Icatlo",
    role: "Museum Curator",
    image: curatorAbel,
  },
  {
    name: "Katherine Dabocol",
    role: "Administrative Assistant II",
    image: curatorKatherine,
  },
  {
    name: "Andrew C. Icatlo",
    role: "Museum Curator",
    image: curatorAndrew,
  },
  {
    name: "Glenda C. Icatlo",
    role: "Museum Curator",
    image: curatorGlenda,
  },
  {
    name: "Jeah C. Icatlo",
    role: "Museum Curator",
    image: curatorJeah,
  },
  {
    name: "Vanessa C. Icatlo",
    role: "Museum Curator",
    image: curatorVanessa,
  },
  {
    name: "Mhiles C. Icatlo",
    role: "Museum Curator",
    image: curatorMhiles,
  },
  {
    name: "Andrea C. Icatlo",
    role: "Museum Curator",
    image: curatorAndrea,
  },
  {
    name: "Toto C. Icatlo",
    role: "Museum Curator",
    image: curatorToto,
  },
  {
    name: "Leni C. Icatlo",
    role: "Museum Curator",
    image: curatorLeni,
  },
  {
    name: "Andex C. Icatlo",
    role: "Museum Curator",
    image: curatorAndex,
  },
];

const CuratorCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const next = () => {
    setFade(false); // trigger fade out
    setTimeout(() => {
      setCurrent((prevIndex) => (prevIndex + 1) % curatorProfiles.length);
      setFade(true); // trigger fade in
    }, 300); // match with CSS transition time
  };

  const prev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prevIndex) => (prevIndex - 1 + curatorProfiles.length) % curatorProfiles.length);
      setFade(true);
    }, 300);
  };

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { name, role, image } = curatorProfiles[current];

  return (
    <div className="w-full h-auto flex items-center justify-center text-center px-8 bg-[#1C1B19] group relative overflow-hidden">
      <div className="w-[140rem] mt-[10rem] transition-opacity duration-500">
        <img
          src={image}
          alt={name}
          className={`w-[30rem] h-[30rem] mx-auto rounded-lg shadow-lg transition-all duration-700 ease-in-out ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <h1 className={`text-[5rem] font-bold mt-[2rem] mb-[2rem] text-[#FCE6BC] transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          {name}
        </h1>
        <h2 className={`text-[3rem] mb-[3rem] text-[#FCE6BC] transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          {role}
        </h2>

        {/* Arrows (show on hover) */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-10 transform -translate-y-1/2 text-[#FCE6BC] text-[4rem] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-10 transform -translate-y-1/2 text-[#FCE6BC] text-[4rem] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          ›
        </button>
      </div>
    </div>
  );
};


const About = () => {
  return (
    <>
      <ScrollRestoration />
    
    <div className='bg-white  flex flex-col gap-y-4 min-h-fit h-fit w-screen pt-7' >
      <div className='min-h-[10%] w-screen'>
        <LandingNav/>
      </div>
      <div className='w-screen h-[40rem] bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${museumBackground})` }}
      >


      </div>
    </div>

      <div className='w-screen h-auto min-h-[79rem] mx-auto font-hina'>
       <div className='max-w-[140rem] 3xl:max-w-[180rem] h-auto min-h-[79rem] mx-auto text-[3rem]'>
          <div className='flex flex-col sm:flex-row mt-[10rem]'>
            
            <span className='w-full sm:w-2/5  h-full '>
            <div className="m-[2rem] sm: max-w-full h-auto  items-end text-justify">
             <p>The Museo Bulawan, also known as the Community Museum of Camarines Norte, embodies the rich cultural and historical essence of the province. Its origins trace back to 1995, when the construction of a new neo-classical provincial capitol building provided a fitting backdrop for the establishment of a museum. The Greco-Roman architecture of the building inspired a vision of timeless grandeur, making it an ideal setting to house artifacts and exhibits that celebrate the province's heritage.
                <img src={museumImage1} alt="About Us" className="mt-6 w-full h-auto rounded-lg shadow-lg" />
              </p>
              </div>
              
            </span>
            <span className='w-full sm:w-3/5 h-full  text-justify'>
            <div className='m-[2rem] sm:m-[2rem]'> 
                <h1 className='text-[5rem] font-bold'>"A museum is a bridge that connects the past to the present, inspiring the future."
                  </h1>
                  <br />
                  <br />
                  <p className='font-bold'>Humble Beginnings
                  </p>
                    <br />
                        <p>Initially, the museum was situated in a modest space at the center of the capitol building's frontage, directly facing the main entrance. Despite its limited size, this initial venue served as a hub for various periodic exhibits and activities. It became an effective platform for the provincial government to foster cultural awareness and education among the youth and the community at large.
                        <br /> <br />
                        Through collaborations with national organizations such as the National Commission for Culture and the Arts (NCCA), the National Museum, and the National Historical Institute, the museum hosted numerous events that sparked a growing interest in local history and cultural preservation. These partnerships deepened the community's sense of identity and strengthened their connection to the national narrative.
                        <br /> <br />
                        This initial phase of the museum also served as a testament to the community's commitment to preserving their heritage despite spatial limitations. The intimate setting encouraged meaningful interactions between visitors and exhibits, fostering a deeper appreciation for the artifacts on display. Local artists, historians, and cultural advocates found a welcoming space to share their work and knowledge, further enriching the museum's offerings. These early efforts laid the groundwork for a vibrant cultural hub that would eventually grow into a larger and more comprehensive institution, embodying the community's dedication to celebrating and safeguarding their shared history.</p>
                        </div>
                 </span>
          </div>

         {/* 2nd Part */}
        <div>
          
        <div className='flex flex-col sm:flex-row mt-[3rem] text-justify'>
           
          <span className='w-full sm:w-1/2  h-full '>
          <div className='m-[2rem] sm:m-auto'>
              <h1 className='text-[4rem] font-bold mb-[6rem]'>“Heritage is not what we inherit from the past; it is what we preserve for the future.”</h1>
              <img src={museumImage2} alt="About Us" className="mt-6 w-full h-auto rounded-lg shadow-lg" />

           </div> 
           </span>
           <span className='w-full sm:w-1/2 h-full m-auto sm:m-[2rem]  '>
              <div className='m-[2rem] sm:mt-[15.5rem]'>
                <h1 className='font-bold'>Expansion and Transformation</h1>
                <br />
                The new location facilitated significant advancements in museum management, including systematic techniques in documentation, research, preservation, and exhibition. Enhanced marketing and promotional efforts further broadened the museum's reach, attracting a diverse audience of local residents and travelers.
                <br />
                <br />
                <span className='text-[15rem] font-bold text-black float-left leading-none mr-4'>O</span>
                <p className='mt-[6.8rem]'>ver time, the museum's popularity and collections grew, outstripping the capacity of its original location. The year 2000 marked a pivotal moment in its history when the museum was relocated to a larger building adjacent to the provincial capitol. This move addressed the need for a more spacious venue, enabling improved collection displays and a more comfortable experience for visitors.
                </p>
              </div>
            </span>

        </div>
        </div>
          {/* 3rd Part */}
        <div>
        <div className='flex flex-col sm:flex-row mt-[3rem] text-justify'>
           
          <span className='w-full sm:w-2/5  h-full'>
          <div className='m-[2rem] sm:m-[2rem]'>
            <h1 className='text-[5rem] font-bold'>
              Museo Bulawan: A Beacon of Cultural Wealth
              </h1>
              <br /><br />
                <p>
                The museum's name, Museo Bulawan—translated as “Golden Museum”—reflects Camarines Norte's distinction as a province historically linked to gold mining. This golden legacy resonates in the museum's exhibits and collections, which include:
                </p>
                <ul className="list-disc ml-[3rem]">
                <br />
                <li>Numismatics: An extensive collection of coins and currencies.</li>
                <li>Portraits of Governors: A gallery honoring the province's leaders.</li>
                <li>Historical Panels: Computer-generated displays illustrating significant moments in local and national history.</li>
                <li>Local Heroes Exhibit: Tributes to the individuals who shaped the province's story.</li>
                <li>Tourism Showcases: Presentations highlighting the scenic beauty and cultural richness of Camarines Norte.rism Showcases: Presentations highlighting the scenic beauty and cultural richness of Camarines Norte.</li>
                </ul>   
              </div>
           </span>
           <span className='w-full sm:w-3/5 h-full flex justify-center items-center'>
           <div className='m-[2rem] sm:m-auto'>
           <img src={museumExhibit} alt="About Us" className="mt-6 w-[100rem] h-auto rounded-lg shadow-lg" />
            </div>
            </span>

        </div>

        </div>
        <div>
        <div className='flex flex-col sm:flex-row text-justify'>
          
           <span className='w-full sm:w-3/5  h-full  '>
           <h1 className='text-[5.3rem] font-bold m-[2rem] sm:m-[2rem]'>
            In addition to these exhibits, the museum hosts periodic events and activities designed to engage children and adults alike, further solidifying its role as a cornerstone of cultural education and community engagement.
           </h1>
            </span>
            <span className='w-full sm:w-2/5 h-full  flex justify-center items-center'>
              <div className='m-[2rem] sm:mx-[2rem]'>
                <h1 className='text-[4.3rem] font-bold'>
                  A Living Heritage
                  </h1>
                <p className='text-[3.1rem] '>
                  Today, Museo Bulawan stands not just as a repository of artifacts but as a dynamic institution that bridges the past and present. It continues to inspire pride and curiosity among its visitors while contributing to the province's tourism appeal. As it moves forward, the museum remains committed to its mission of preserving and showcasing the golden heritage of Camarines Norte, ensuring that future generations can connect with their roots and celebrate their identity.
                  </p>
              </div>
             </span>
 
         </div>
          
        </div>

        {/* 4th part */}
        <div>
        <div className="w-screen sm:w-full h-auto sm:h-[63rem] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white text-center px-8 my-[2rem] sm:my-auto"
            style={{ backgroundImage: `url(${visionBackground})` }}>
            <div className='w-[140rem] my-[2rem]'>
              <h1 className="text-[5rem] font-bold mb-[3rem]">Vision</h1>
              <p className="text-[2.4rem] text-center leading-[4rem]">
                Museo Bulawan is the leading and the most viewer-friendly community
                museum that serves as the nerve center for education and communication of
                the rich cultural, artistic, and natural heritage and history of
                Camarines Norte and the ultimate medium for preservation and exhibition
                of significant objects that strengthen the values of the people and
                deepen their patriotism and sense of identity.
              </p>
            </div>
          </div>
        </div>
            {/* 5th part */}
            <div>
          <div className="w-full h-auto sm:h-[55rem] flex items-center justify-center text-center px-8 mb-[3rem] sm:mb-auto">
              <div className='w-auto sm:w-[140rem] '>
                <h1 className="text-[5rem] font-bold mb-[2rem]">Mission</h1>
                <p className="text-[2.4rem] text-center leading-[4rem]">
                  Collect, research, conserve, exhibit and disseminate knowledge of significant past so as to enhance social life and sustain the
                  efforts to social transformation and development. Educate, entertain and excite the various publics through systematic preservation, protection, promotion and publication of the material culture of the society.Sustain the process of social progress through the communicative function of the museum towards inculcation of values, greater appreciation and understanding of arts and culture as well as production of relevant information that boosts the pride of place of the people and their sense of national purpose.
                  </p>
              </div>
          </div>
        </div>
            {/* 6th part */}
            <div>
              <div className="w-full h-auto  flex items-center justify-center text-center px-8 bg-[#1C1B19] ">
                <div className='w-[140rem] mt-[10rem]'>
                  <h1 className="text-[4rem] mb-[3rem] text-[#FCE6BC]">A Message From The Museum Curator's</h1>
                    <h1 className="text-[5rem] font-bold mb-[3rem] text-[#FCE6BC]">Mr. Abel C. Icatlo</h1>
                      <img src={curatorMessage} alt="Abel C. Icatlo" className='w-[30rem] h-auto mx-auto'/>
                      <p className="w-auto  h-full text-[2.4rem] text-center leading-[4rem] text-white mx-auto sm:mx-[25rem] mt-[5rem] mb-[10rem]">
                            Through the pages of history we saw the searing revolutionary fire of the nationalist heroes of Camarines Norte who convulsed in a determined uprising in Daet in April 1898 and later established the First Rizal Monument in December of that year. The seeds of freedom sown by the local heroes of this Province engendered an awakened nation and a people who were wont to pay the price of freedom. Through the wars and dictatorship, the people of Camarines Norte seasoned the challenges with perseverance and fortitude.
                            Museo Bulawan, which is a community museum, attempts to capture the rich panorama of struggle of the Local people. History aside, Museo Bulawan, showcases as well the exquisite treasure of this province which is gold. Actually, bulawan is a Filipino word for gold and it is said that Camarines Norte is a province that sits in a mound of gold.
                            Not only does the Provincial Government of Camarines Norte mind itself on the material development of the people but more so, it strives to zero in on the software of social and economic development which is the cultural, ethical and moral upliftment of the people. And there is no other way by which this can be effectively done except through the powerful tool of culture and arts.
                            Hence, genuine socio -economic progress becomes possible through the developmental firepower of culture clarified and inculcated in the minds and hearts of the people.
                            Museo Bulawan is dynamically spearheading this thrust on cultural development being at the forefront of heritage, cultural and artistic endeavors of the local government. And we hold the conviction that cultural development is the ultimate driving force to continually rekindle and spread courage, resiliency, integrity, moral strength and patriotic and nationalistic fervor.
                          </p>
                </div>
              </div>
            </div>

            {/* 7th part */}
            <div>
              <img src={keyPeopleHeader} alt="" />
                <div className='w-auto text-center my-[5rem] '>
                  <h1 className='text-[5rem] mb-[2rem] font-bold'>
                    Key People
                  </h1>
                  <h2 className='font-bold'>
                    Pure Professionalism
                  </h2>
                  <p className='w-auto mx-[2rem] sm:mx-[20rem] m-[2rem]'>
                    Our dedicated team of experienced professionals are always on the ball, utilizing their unique skills and passion to move the work of Museum. We’re always pushing ourselves to stay ahead of the curve and striving to perfect our programs. Meet some of our incredible employees below.
                  </p>
                </div>
            </div>

            {/* 8th part */}
            <div>
              <div>
              <CuratorCarousel />
              </div>
            </div>

      </div>
    </div>
    </>
  )
}

export default About
