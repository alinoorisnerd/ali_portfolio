/* =========================================================
   MEDIA — every photo, video and certificate on the site.

   HOW TO ADD YOUR OWN:
   1. Put the file in assets/images, assets/videos or assets/certificates.
   2. Make sure the "src" below matches the file name exactly
      (it is case-sensitive on GitHub Pages: Robot.JPG ≠ robot.jpg).
   3. Until a file exists, the site shows a placeholder with the path
      it is waiting for, so nothing looks broken.

   type:   "image" | "video" | "youtube"
   src:    path to the file (image/video) or the YouTube video ID
   caption: short text shown on the slide
   ========================================================= */
window.MEDIA = {
  about: [
    { type: 'image', src: 'assets/pics/01.About/1.jpg', caption: 'With Dr. Lisa Su, CEO of AMD' },
    { type: 'image', src: 'assets/pics/01.About/2.png', caption: 'Me :)' },
    { type: 'image', src: 'assets/pics/01.About/3.png', caption: 'Machine Lab' },
    { type: 'image', src: 'assets/pics/01.About/4.png', caption: 'Qualcomm Innovator Development Kit' }
  ],
  ebrain: [
    { type: 'image', src: 'assets/pics/ebrain-demo.jpg', caption: 'Live on-device demo' }
  ],
  wowza: [
    { type: 'image', src: 'assets/pics/02.Experience/1.png', caption: '' }
  ],
  seal: [
    { type: 'image', src: 'assets/pics/02.Experience/4.jpg', caption: 'Former President of Israel and Ambassador UAE to USA' },
    { type: 'image', src: 'assets/pics/02.Experience/3.png', caption: 'Ambassador of Pakistan to UAE' },
    { type: 'image', src: 'assets/pics/02.Experience/2.png', caption: 'Hosting US Embassy Representative' }
  ],
  workshop: [
    { type: 'image', src: 'assets/pics/02.Experience/5.png', caption: '' },
  ],
  fgs: [
    { type: 'image', src: 'assets/pics/02.Experience/6.jpg', caption: '' },
  ],
  mastereyes: [
    { type: 'image', src: 'assets/pics/02.Experience/7.jpg', caption: '' },
  ],
  rumi: [
    { type: 'image', src: 'assets/pics/03.Featured_Projects/More_project/1.JPG', caption: 'Initial version with gyroscope, battery cell, and infinity view' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/More_project/2.JPG', caption: 'A.R display in action' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/More_project/3.JPG', caption: 'Demonstration - being tested by Head of Department' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/More_project/4.png', caption: 'Tiny ML quantized model' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/More_project/5.png', caption: 'Initial sketch of optics, viewing at infinity' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/More_project/6.png', caption: 'XiaoSeed Controller wiring' },
  ],
  robot: [
    { type: 'image', src: 'assets/pics/03.Featured_Projects/performing robot/1.png', caption: 'End of the semester performance' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/performing robot/3.png', caption: 'Fitting in custom PCBs' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/performing robot/4.png', caption : 'Repairment after the fall' },
  ],
  solar: [
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/2.png', caption: 'Finished 3-layer PCB' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/1.png', caption: 'Easy EDA Design' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/3.png', caption: '3D CAD design in Onshape for enclosure' }
  ],
  pid: [
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/5.jpg', caption: 'Soldered by hand, fitted inside 3D printed enclosure' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/4.jpg', caption: 'Temperature controller for SLS-Printer' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/6.jpg', caption: 'Re-engineering P.D system for the SLS-Printer' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/7.jpg', caption: 'Custom PCB for keypad and controls' }
  ],
  harp: [
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/8.png', caption: 'Water harp playing' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/9.png', caption: 'CNC-cut frame' },
    { type: 'image', src: 'assets/pics/03.Featured_Projects/Other_Builds/10.png', caption: 'Professor Mang giving it a try' }
  ],
  hotspot: [
    { type: 'youtube', src: 'https://youtu.be/QtNws-tsdQI', caption: 'Hotspot app demo - Summer 2026' }
  ],
  igem: [
    { type: 'image', src: 'assets/pics/04.Leadership/1.jpg', caption: 'Team at the Grand Jamboree, Paris' },
    { type: 'image', src: 'assets/pics/04.Leadership/2.png', caption: 'Wiki landing page' }
  ],
  fll: [
    { type: 'image', src: 'assets/pics/05.Certificates_Awards/7.jpg', caption: 'Best Mechanical Design award' },
    { type: 'image', src: 'assets/pics/05.Certificates_Awards/6.jpg', caption: 'Our robot' }
  ],

  certificates: [
    { type: 'image', src: 'assets/pics/05.Certificates_Awards/2.png', caption: 'Certificate of Recognition — Qualcomm University Developer Symposium ’26' },
    { type: 'image', src: 'assets/pics/05.Certificates_Awards/1.png', caption: 'Best Student Representative on Campus — Qualcomm, among 21 teams' },
    { type: 'image', src: 'assets/pics/05.Certificates_Awards/3.jpg', caption: 'Yale University Summer Program — Deep Learning & Neural Networks (2021)' },
    { type: 'image', src: 'assets/pics/05.Certificates_Awards/5.jpg', caption: 'Oxford & Cambridge Summer Program — Diplomacy & Leadership (2018)' },
  ],

  processor: [
  { type: 'image', src: 'assets/pics/03.Featured_Projects/risc/0.png', caption: 'Spartan-3E FPGA' },
  { type: 'image', src: 'assets/pics/03.Featured_Projects/risc/1.png', caption: 'Behavioural Simulation' },
  { type: 'image', src: 'assets/pics/03.Featured_Projects/risc/2.png', caption: 'Floor plan' },
],

  // Photography: add as many as you like; "ar" is the placeholder shape (width / height)
  photos: [
    { type: 'image', src: 'assets/pics/photography/1.jpg', caption: '', ar: '4/5' },
    { type: 'image', src: 'assets/pics/photography/2.jpg', caption: '', ar: '3/2' },
    { type: 'image', src: 'assets/pics/photography/3.jpg', caption: '', ar: '1/1' },
    { type: 'image', src: 'assets/pics/photography/4.jpg', caption: '', ar: '4/5' },
    { type: 'image', src: 'assets/pics/photography/6.jpg', caption: '', ar: '2/3' },
    { type: 'image', src: 'assets/pics/photography/7.jpg', caption: '', ar: '3/2' },
    { type: 'image', src: 'assets/pics/photography/5.jpg', caption: '', ar: '3/2' },
  ]
};
