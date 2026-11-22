import contact from './contact.en.ts';
import about from './about.en.ts';
import technology from './technology.en.ts';
import product3d from './product.en.ts';
const en = {
  product3d,
  contact,
  technology,
  nav: { home: 'Home', product: 'Product', applications: 'Tech & Scenarios', about: 'About Us', menu: 'Open navigation', closeMenu: 'Close navigation', skip: 'Skip to content', language: 'Website language', backTop: 'Back to top' },
  common: { explore: 'Explore Cora', viewModel: 'View product', learnMore: 'Discover more', close: 'Close details', concept: 'Future concept', planned: 'Planned capability', prototype: 'Ground prototype', pending: 'To be confirmed', imageError: 'Image unavailable', imageRetry: 'Try again', imageAlt: 'Cora, Aster’s modular robotic platform', next: 'Next', previous: 'Previous', select: 'Select', status: 'Development status', teamAlt: 'The five members of the Aster team', orbitAlt: 'The International Space Station above Earth', sourceNote: 'Based on the supplied project materials. Flight performance and mission qualification remain to be validated.' },
  footer: { line: 'Intelligence for the next frontier.', description: 'Modular by design. By your side in space.', copyright: '© 2026 Aster. All rights reserved.', top: 'Back to top' },
  intro: {
    title: 'Your pass to exploration.', description: 'Meet Cora. Discover a more human future in space.',
    skip: 'Skip intro', enter: 'Enter directly', passType: 'Exploration Pass',
    stubTitle: 'Welcome to Aster Space', pullOutward: 'Pull to explore',
    issuedBy: 'An invitation from Aster', tagline: 'Modular intelligence\nfor space operations.',
    dragHorizontal: 'Grab the stub and pull outward to begin.',
    keepPulling: 'A little further. New possibilities are close.', release: 'Let go to begin your exploration.',
    opening: 'Opening your next chapter…', ready: 'Ready to explore. Welcome to Aster.',
    stubAria: 'Tear the exploration pass to enter Home. Press Enter or Space, or drag the stub outward.',
    imageAlt: 'Line illustration of Cora beside a space station above Earth',
  },
  home: {
    sectionNavigation: 'Home sections',
    hero: {
      title: 'Welcome Aboard', subtitle: 'Explore the future of space robotics with Cora.',
      description: 'Meet Cora, your onboard robotic assistant developed by Aster.',
      start: 'Begin the Journey', meet: 'Meet Cora', greetCora: 'Say hello to Cora', continueGuide: 'Continue exploring with Cora',
      clickHint: 'Click Cora to say hello', guideLabel: 'Cora interactive guide',
      guideMessages: ["Hi, I'm Cora, your guide today!", "Welcome aboard. Let's explore the future of space robotics together."],
      smilingAlt: 'Cora with a friendly smiling face on its front screen',
      listen: 'Listen to Cora', stop: 'Stop voice preview', voiceUnavailable: 'Voice preview is unavailable in this browser',
      voicePlaying: 'Cora is speaking.', voiceStopped: 'Voice preview stopped.', voiceError: 'Voice preview could not start. Try again.',
      voiceLoading: 'Preparing Cora’s voice…', voiceNotReady: 'Cora’s voice is not ready yet. Please try again later.',
    },
    whyCora: {
      title: 'Why Cora?',
      description: 'Alongside their primary mission duties, astronauts also need to find supplies, update inventory records, and hand over tasks to the next shift. Cora is designed to help with that everyday work.',
      action: 'Explore Our Journey',
      imageAlt: 'Equipment racks and supplies inside the International Space Station',
    },
    journey: {
      title: 'Our Journey', subtitle: 'From an Earth-based prototype to future missions on the Moon and Mars.',
      previous: 'Previous', next: 'Next',
      pause: 'Pause orbit', resume: 'Resume orbit', detailNav: 'Journey details',
      stages: [
        {
          label: 'Earth', phase: 'Ground Prototype', title: 'Where Cora Began',
          description: 'Cora began with a practical question: how can we help astronauts spend less time on routine work? Our ground prototype demonstrates basic QR recognition, voice interaction, and movement on the ground.',
          imageAlt: 'Rendering of Cora’s white chassis with a front screen and corner ducts', caption: 'Cora model rendering',
        },
        {
          label: 'Launch', phase: 'Validation Plan', title: 'Preparing for Mission Testing',
          description: 'The next step is to test Cora’s hardware interfaces, crew workflows, and system integration in a simulated cabin before pursuing flight testing.',
          imageAlt: 'A rocket lifting off above plumes of exhaust', caption: 'Illustrative launch photograph',
        },
        {
          label: 'Orbit', phase: 'Validation Plan', title: 'Learning to Move in Orbit',
          description: 'Future testing would examine how Cora moves, determines its position, and holds a stable position at a designated point in microgravity.',
          imageAlt: 'Concept scene of Cora floating in a station passageway', caption: 'Cabin mobility concept',
        },
        {
          label: 'Station', phase: 'Application Concept', title: 'Supporting Daily Station Work',
          description: 'On a space station, Cora could help a crew member locate a tool, scan its label, update the inventory record, and leave that information for the next shift.',
          imageAlt: 'Concept scene of Cora facing equipment racks inside a station cabin', caption: 'Station work concept',
        },
        {
          label: 'Moon', phase: 'Future Upgrade', title: 'Supporting a Lunar Base',
          description: 'An upgraded Cora could help crews check equipment before and after surface excursions, move small supplies within the lunar habitat, and inspect designated areas with task-specific modules.',
          imageAlt: 'An astronaut and equipment on the lunar surface', caption: 'Lunar surface reference',
        },
        {
          label: 'Mars', phase: 'Long-Term Vision', title: 'Supporting Long Stays on Mars',
          description: 'A future version of Cora could carry out scheduled checks, log unusual readings, and give crews a local summary to help them plan maintenance during long stays on Mars.',
          imageAlt: 'Concept illustration of habitat modules on the Martian surface', caption: 'Mars habitat concept',
        },
      ],
    },
    meetCora: {
      title: 'Meet Cora', subtitle: 'Intelligent, modular, and designed for the future of space-station robotics.',
      action: 'Explore Cora',
    },
    slogan: 'An intelligent onboard assistant\nfor space missions.',
    intro: 'A modular robotic platform for everyday assistance, adaptable tools and a more human future in space.',
    view: 'Explore product views',
    visualCaption: 'Purpose-built for life beyond Earth.',
    scroll: 'Discover what’s possible',
    valuesTitle: 'One platform.\nMore possibilities.',
    valuesIntro: 'Connecting perception, interaction and task-specific tools to make everyday assistance easier to call upon.',
    values: [
      { title: 'Intelligent assistance', text: 'Bring routine requests, information and task support into one accessible platform.' },
      { title: 'Multimodal perception', text: 'Connect visual observations and voice input for more useful interactions.' },
      { title: 'Modular expansion', text: 'Keep a common core. Adapt the tools to the needs of each mission.' },
      { title: 'Human–robot collaboration', text: 'Put people at the center, with clear feedback and controlled actions.' }
    ],
    discoverTitle: 'A closer look at Cora.',
    discover: [
      { title: 'Designed to adapt.', text: 'Meet the platform and the thinking inside it.', action: 'Explore the product' },
      { title: 'A place in the mission.', text: 'Explore daily support in tomorrow’s space habitats.', action: 'Discover applications' },
      { title: 'Built with purpose.', text: 'Meet the students looking beyond the horizon.', action: 'Meet Aster' }
    ]
  },
  product: {
    heroDescription: 'A modular intelligent robotic platform for onboard space support.', title: 'Cora', intro: 'A common core.\nAn open world of possibilities.', sub: 'Explore the real design of our modular robotic platform, built around the people and tasks of future space habitats.',
    anchors: ['Overview', 'Core functions', 'Technology', 'Modular design', 'Specifications'],
    viewer: { title: 'Meet Cora, from every side.', description: 'Explore the supplied product images and select a highlighted component to learn more.', imageMode: 'Product image explorer', note: 'Image preview · 3D model coming later', unavailable: 'White-finish product visualization · image preview only. Interactive 3D will follow a web-ready model.', zoomIn: 'Zoom in on image', zoomOut: 'Zoom out of image', reset: 'Reset view and zoom', imageZoom: 'Image zoom', viewLabel: 'Product view', views: ['Perspective', 'Front', 'Left', 'Rear', 'Right', 'Top', 'Bottom'], hotspotHint: 'Select a component to explore', hotspotLabel: 'View component:', previewAlt: 'Cora product image,', noHotspots: 'Component annotations are available in the perspective view.', loading: 'Loading 3D model…', modelError: 'The 3D model could not load. Product images are still available.', imageFallback: 'Use product images',
      hotspots: [
        { title: 'Front display', text: 'A front-facing screen presents recognition results, device status and interaction feedback.', detail: 'Shared visual feedback for the crew.' },
        { title: 'Sensor system', text: 'The camera is the common input for QR recognition and face detection in the ground prototype.', detail: 'Perception begins with a clear view.' },
        { title: 'Corner propulsion units', text: 'The eight-corner ducted-fan design explores multidirectional motion in a pressurized microgravity cabin. Thrust, torque and attitude control require further validation.', detail: 'Propulsion research, not qualified flight.' },
        { title: 'Side module interface', text: 'Interfaces on both sides are intended to connect task-specific tools while retaining the same computing and interaction core.', detail: 'Future modules share one platform.' },
        { title: 'Ventilation structure', text: 'Vented body panels are visible in the supplied product design. Thermal performance and operating limits await validation.', detail: 'Designed around an integrated system.' }
      ]
    },
    functions: { title: 'A thoughtful core.\nA purposeful set of tools.', intro: 'Explore current ground-prototype functions and the capabilities we are working toward.', tabs: [
      { title: 'Autonomous mobility', heading: 'Moving toward greater autonomy.', text: 'The ground prototype demonstrates controlled movement. Autonomous cabin navigation and microgravity propulsion are development goals, with localization, thrust and attitude control still to be tested.', tag: 'Planned capability', items: ['Controlled ground movement', 'Local permission and stop checks', 'Future localization and path planning'] },
      { title: 'Environmental perception', heading: 'More awareness of the cabin.', text: 'Camera observations form the current visual input. Future sensor modules could extend the platform to gather environmental information for onboard tasks.', tag: 'Planned capability', items: ['Shared camera input', 'Task-specific sensor expansion', 'Environmental measurements to be validated'] },
      { title: 'Computer vision & AI', heading: 'From observation to useful information.', text: 'The ground prototype combines QR decoding, face detection and expression classification. Visual events are coordinated with the screen and voice workflows.', tag: 'Ground prototype', items: ['QR-based item identification', 'OpenCV vision processing', 'Context-aware interaction events'] },
      { title: 'Equipment monitoring', heading: 'Support for routine checks.', text: 'Future monitoring workflows could connect visual records and compatible tools to help crews review equipment conditions. Autonomous fault detection has not been validated.', tag: 'Planned capability', items: ['Visual equipment records', 'Compatible sensor tools', 'Human review of observations'] },
      { title: 'Astronaut interaction', heading: 'Assistance starts with a request.', text: 'Voice input, a front display and local control checks connect people to device functions. Current language services use a network-connected workflow in the ground prototype.', tag: 'Ground prototype', items: ['Local voice wake-up', 'Voice and screen feedback', 'Explicit control permissions'] },
      { title: 'Task records', heading: 'Capture the details that matter.', text: 'A voice request can trigger photo capture, saving and completion feedback. Connecting records to task identifiers and timestamps is a future extension.', tag: 'Ground prototype', items: ['Voice-requested photo capture', 'Saved images and completion feedback', 'Future task-linked records'] }
    ] },
    technology: { title: 'Connected by design.', intro: 'A distributed embedded architecture gives perception, interaction and control a clear role. Select a layer to explore the system.', caption: 'System architecture · functional overview', nodes: [
      { title: 'Perception', label: 'Camera & inputs', heading: 'A shared view of the environment.', text: 'Camera frames feed QR decoding and face analysis. Microphone input follows the audio-processing chain. Sensor extensions remain task-specific concepts.' },
      { title: 'Processing', label: 'Raspberry Pi', heading: 'Turn inputs into useful events.', text: 'The Raspberry Pi handles visual processing, the graphical interface and device coordination. Python, OpenCV, NumPy and Pygame support these prototype workflows.' },
      { title: 'Control', label: 'Board A → Board B', heading: 'Separate requests from execution.', text: 'Board A manages movement requests, permissions and control ownership. Board B drives the fans. State checks, heartbeat handling and stop logic coordinate execution.' },
      { title: 'Interaction', label: 'ESP32-S3 & display', heading: 'Keep people in the loop.', text: 'ESP32-S3 manages audio capture, local wake-up and playback. Network-connected language services link requests to supported tools, with feedback on the display and speaker.' },
      { title: 'Expansion', label: 'Dual-side interfaces', heading: 'Add tools as missions evolve.', text: 'The common computing and interaction platform is intended to support interchangeable task tools. Interface reliability and loaded configurations require further development and testing.' }
    ] },
    modules: { title: 'Same core.\nA different mission.', intro: 'Select a tool to explore the modular concept. Each module is a future extension, shown using the supplied concept render.', interface: 'Cora dual-side interface', connection: 'Interface concept', imageNote: 'Concept render · connection shown schematically', items: [
      { title: 'Cargo container', text: 'A compact, latched container concept for carrying small supplies and research items between work areas.', use: 'Small-item transport' },
      { title: 'Temperature sensor', text: 'A sensing-tool concept for collecting local temperature observations during task-specific environmental checks.', use: 'Local environmental sampling' },
      { title: 'Robotic arm', text: 'A compact manipulation concept for future controlled handling tasks. Reach, payload and operational safety require validation.', use: 'Controlled object handling' },
      { title: 'Pump & valve module', text: 'A configurable tool concept for research into fluid-handling and valve-related support tasks.', use: 'Task-specific fluid support' }
    ] },
    specs: { title: 'The platform, at a glance.', intro: 'Current architecture is described below. Measured hardware specifications will be added after verification.', columns: ['Parameter', 'Current information'], rows: [
      ['Development stage', 'Ground prototype; not flight qualified'], ['Main computing', 'Raspberry Pi'], ['Voice interaction', 'ESP32-S3'], ['Motion control', 'Board A / Board B distributed control'], ['Module connections', 'Dual-side interface design'], ['Dimensions & mass', 'To be confirmed after measurement'], ['Power & endurance', 'To be confirmed after testing'], ['Propulsion & navigation performance', 'To be confirmed after validation']
    ] }
  },
  applications: {
    title: 'From station operations\nto future exploration.', intro: 'From everyday station operations to the next chapter of exploration. Discover where a shared robotic platform could make a difference.',
    sceneLabel: 'Mission scenario', conceptNote: 'Application concept · supplied scene illustration', selectLabel: 'Choose a mission scenario', flowTitle: 'From request to response.', flowIntro: 'A clear, human-centered task loop. Select a step to see how a request could move through the system.', stepsLabel: 'Illustrative mission workflow',
    scenarios: [
      { title: 'In-station inspection', short: 'Inspection', description: 'Support routine visual checks of cabin work areas and equipment, with image records for crew review.', steps: ['Request a visual check', 'Observe the work area', 'Review and save observations'] },
      { title: 'Environmental monitoring', short: 'Environment', description: 'Explore localized cabin observations with compatible sensing modules and present information for human review.', steps: ['Select a sensing task', 'Collect local observations', 'Report readings for review'] },
      { title: 'Inventory support', short: 'Inventory', description: 'Use QR-based identification to display and read item information. Associating items with storage areas is a future extension.', steps: ['Present an item label', 'Decode the QR information', 'Display and read the result'] },
      { title: 'Task assistance & interaction', short: 'Task assistance', description: 'Connect voice requests, photo documentation and clear completion feedback in one approachable interface.', steps: ['Receive a voice request', 'Call the supported tool', 'Confirm task completion'] }
    ],
    workflow: [
      { title: 'Task request', text: 'A crew member makes a clear request. Supported tools and control permissions determine what the platform can do.' },
      { title: 'Perception', text: 'The camera or a compatible sensor gathers the information needed for the selected task.' },
      { title: 'AI analysis', text: 'Relevant visual or language processing turns inputs into information. Movement requests remain subject to local checks.' },
      { title: 'Feedback & records', text: 'The screen and voice interface report results. Supported records are saved for later review.' }
    ],
    futureTitle: 'Built with a longer view.', futureIntro: 'These are directions for future research. Each would require mission-specific adaptation, qualification and integration.', future: [
      { title: 'Commercial space stations', text: 'Configurable assistance for emerging orbital workspaces.' },
      { title: 'Long-duration missions', text: 'Task support for crews spending more time away from Earth.' },
      { title: 'Lunar habitats', text: 'Adaptable tools for future pressurized surface habitats.' },
      { title: 'Deep-space exploration', text: 'A long-term vision for more independent mission support.' }
    ], productLink: 'Explore the platform behind the mission'
  },
  about,
};
export type Dictionary = typeof en;
export default en;
