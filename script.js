'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('operations__tab');
const tabsContainer = document.querySelector('operations__tab-container')
const tabsContent = document.querySelectorAll('operations__content')
const nav = document.querySelector('.nav')

const openModal = function (e) {
  e.preventDefault();
  //preventdefault because href defualt behavior is to jump back on top
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//btnsOpenModel has queryselectorall making it node list which is not arr
//but forEach works with it
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button scrolling
btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();

  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //   scrolling
  //   window.scrollTo(
  //     s1coords.left + window.pageXOffset,
  //     s1coords.top + window.pageYOffset
  //   )
  // })

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset
  // })

  section1.scrollIntoView({ behavior: 'smooth' });
  ////////////////////////////

  // Page navigation

  // document.querySelectorAll('.nav__link').forEach((el) => {
  //   //el = current el in node list
  //   el.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     const id = this.getAttribute('href');
  //     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
  //   })
  // })
  //return node list
  //ue forEach and attach event handler

  //event delegation
  //1st addeventlistener to common parent element (links)
  //2. in that event listener determine what element originated the event
  //to then work with element where event was created

  // document.querySelector('.nav__links'); //common element of all links
  document.querySelector('.nav__links').addEventListener('click', e => {
    console.log(e.target); //figure out where e happ
    //matching strategy
    e.preventDefault();

    if (e.target.classList.contains('.nav__link')) {
      const id = e.target.getAttribute('href');
      console.log(id);
      document.querySelector(id).scrollIntoVire({
        behavior: 'smooth',
      });
    }
  });
});

//tabbed component


//this is bad cause if u have 200 tabs, it makes 200 
//copies of this exact callback, which slows pg down
// tabs.forEach(tab => tab.addEventListener('click', () => {
//   console.log('TAB');
// }))

//use event delegation
//for e delegation attach the e handler on common parent 
//element in all elements we are interested in, in our case it is tabsContainer

tabsContainer.addEventListener('click', function(e) {
    //matching strategy
    const clicked = e.target.closest('.operations__tab');
    console.log(clicked); 

    //modern guard clause
    if(!clicked) return; //we have not done this before, called a guard clause
    //guard clause = an if statement which returns early if some condition is matched
    //when we have null which is a falsy value, 
    //then not falsy will become true and function will return and no code after will be executed
    //if click exists then this return will not be executed and rest will be executed

    //past way of doing guard clause
      
      tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
      clicked.classList.add('operations__tab--active');

    tabsContent.forEach(content => content.classlist.remove('operations__tabe--active'))
    
    
    //ignore any clicks where the result is null
    
    //activate tab        
    clicked.classList.add('operations__tab--active')

    //lets activate content area
    //attributes are in the element and then in the dataset property
    //so the element that was clicked is indeed stored in our variable clicked

    
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

//Menu Fade animation
//we need to do event delegation, find common parent of all of the links
//also including the logo

const handleHover = function(e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target; //this is element we are working with
    const siblings = link.closest('.nav').
    querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sib => {
      if(sib !== link) sib.style.opacity = this; //THIS IS OPACITY NOW
      logo.style.opacity = this; //THIS IS OPACITY NOW
    })
  }
}

//passing "argument" (not really arg) into handler
nav.addEventListener('mouseover', handleHover.bind(0.5))

nav.addEventListener('mouseout', handlehover.bind(1))

//sticky nav
const initialCoords = section1.getBoundingClientRect();
//to implement use scroll event (available on window) for now
window.addEventListener('scroll', function(){
  console.log(window.scrollY);

  if(this.window.scrollY > initialCoords.top) nav.classList.add('sticky')
  else nav.classList.remove(sticky)
})

// const obsCallback = function(entries, observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }

// const obsOptions = {
//   root: null, //root is el that target is intersecting
//   threshold: [0, 0.2] //% of intersection the observer callback will be called
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1); //(target element)

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height

const stickyNav = function(entries){
  const [entry] = entries //same as entries[0]; destructuring
  console.log(entry);
  if(!entry.isIntersecting) nav.classList.add('sticky')
  else
  nav.classList.remove('sticky')
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, //when 0% of header is visible then sticky nav comes
  rootMargin: `-${navHeight}px` //when scrolling to next section, before next section starts the size of nav will be when the nv appears

});
headerObserver.observe(header)

//Reveal sections
const allSections = document.querySelectorAll('.section')

const revealSection = function(entries, observer){
  const [entry] = entries;
  console.log(entries);

  //we can use the target to see which specific section intersected the viewport
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  //unobserve for no more CL
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15 //section revealed when it is 15% visible
});
//use foreach w.e we want to do something doesn't involve creating new arr
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
}) 

//lazy loading images, good for performance
const imgTargets = document.querySelectorAll('img[data-src]')

const loadImg = (entries, observer) => {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  //replace src attribute with the data.src
  entry.target.src = entry.target.dataset.src; //dataset = special data properties are stored
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => imgObserver.observe(img))

//slides
//good practice to keep this functionality in its own function
//to not pollute global namespace
const slider = () => {
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

//1st slide:0, 2nd:100%, 200%, 300%
//functions
const createDots = () => {
  slides.forEach(( _ , i) => {
    dotContainer.insertAdjacentHTML('beforeend',
    `<button class="dots__dot data-slide="${i}"></button>)`); //good method for creating html elements
  })
}

createDots();

const activateDot = (slide) => {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active')
    //1st step removing active classes, then add it on the one we are intersted in

    //select the 1 u want? based on data attribute
    document.querySelector(`.dots__dot[data-slide="${slide}]`)
    .classList.add('dots__dot--active')
  })
}
activateDot(0)

const goToSlide = (slide) => {
slides.forEach((slide, i) => {slide.style.transform = `translateX(${100 * (i - slide)}%)`}) }

goToSlide(0);

const nextSlide = () => {
  if(curSlide === maxSlide - 1 ) {
    curSlide = 0;
    //this is how return to beginning of slice
  } else {
    curSlide++//go to next slide we increase by 1
  }
  goToSlide(curSlide)
  activateDot(curSlide)
}

const prevSlide = () => {
  if(curSlide === 0){
    curSlide === maxSlide - 1;
  }
  else {
    curSlide--;
  }
  curSlide--;
  goToSlide(curSlide)
  activateDot(curSlide)
};

const init = () => {
  createDots();
  goToSlide(0);
  activateDot(0);
}
init()

//event handlers
//go to next slide
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
})
//1st slide:-100, 2nd:0%, 100%, 200%
//take cur i, and subtract current slide

//event delagation, not an event listener to each dot, but to common parent
dotContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    goToSlide(slide)
    activateDot(slide)
  }
})
};
slider();
// ////////////////////////////, 
// /////////////////////////
// //////////////////////////

//2nd to last vid in advanced DOM
/**
 lifecycle DOM Events

 diff e, occur in dom during webpg lifecycle
 lifecycle= right from momement pg is 1st accessed until user leaves
 */

 //DOM content loaded
 //this e, is fired by the document as soon as HTML is completely parsed
 //means HTML has been downloaded and been converted to the DOM tree
 //also all scripts must be downloaded and executed before DOM content loaded e can happen
 document.addEventListener('DOMContentLoaded', (e) => {
  //this e, does not wait for img/other external resources to load
  //so just HTML and JS need to be loaded
  console.log('HTML parsed and DOM tree built!', e);
 })

 //we want all our code only to be executed after the DOM is
 //ready, should we wrap out code into an e listener?
 //no. Because we have the script tag which imports JS into the HTML right at the end of the body
 //When we have script tag at the end of HTML
 //then we dont need to listen for the DOM content loaded event
 //other ways loading JS file with script tag

 //theres also load e, load e is fired by the window as soon as not only HTML is parsed
 //but also all the images and external resources like CSS files
 //are also loaded. Basically when the complete pg has finished loading
 //is when this e gets fired.

 window.addEventListener('load', (e) => {
  console.log('Page fully loaded', e);
 })

 //beforeUnloadEvent
 //gets fired on window
 window.addEventListener('beforeunload', () => {
   //e is created immediately before user is going to leave pg
   //we can use e, to ask users if they are 100% sure they want to leave pg
   e.preventDefault(); // not necessary in chrome
   console.log(e);
   //in order to display a leaving conformation
   //set return val on the e to an empty string
   e.returnValue = ''; //for historical reasosns

   //Efficient Script Loading: and Async
   //diff ways of loading a JS script in HTML

   //we always used reg way of including js files into our HTML
   //we can also add async attribute to script tag or the defer attribute
   //regular = <script src="script.js"></script>
   //Async = <script async src = 'script.js'></script>
   //Defer = <script defer src ="script.js"></script>

   //these attributes influence the way in which the JS file is fetched
   //which means download and then executed
   //in the HTML we can write script tag in the document head
   //or at the end of the body

   //when we include a script without any attribute in the head what will pg loading process look like over time?
   //as the user loads pg and receives the HTML, the HTML code will start to be parsed by the browser
   /**
    parsing thourgh html is basically building the DOM tree from the HTML elements.
    then at a certain point it will find our script tag start to fetch the script and then execute it
    during all this time, the html parsing will stop so it will be waiting for the script to get fetched and executed
    only after that, the rest of the html can be parsed and at the end of that parsing the DOM content loaded e will finally get fired as we learned in the last video
    this is not ideal at all. we dont want the browser to be just sitting there doing nothing
    this can have huge impac on pg performance, + in this case script will be executed before the DOM is ready
    so not ideal
    never include script in the head like this
    thats why we usually put script tag at end of body so all html is already parsed when finally reaches script tag
    in this situation this is how the page loading process looks like
    HTML is parsed, then script tag found end of document, then script is fetched then script gets executed
    
    but this is not perfect
    bcause script could of been downloaded before while HTML was still being parsed
    what about ASYNC attribute? this is what the loading process looks like
    using async script loading head of document
    as u see the diff is that the script is loaded at same time as the html is parsed
    inan async way
    HTML parsing still stops for the script execution
    script is downloaded asynchronously but then its executed right away in a synchronous way
    so html code has to wait for being parsed, but anyway as we can see from
    the length of the diagrams, makes pg loading time shorter
    what about the defer attribute
    when deferring what happens is script is loaded asynchronously but the execetuion of script is deferred until end of HTML parsing
    in practice loading time is similar to async attribute, but key diff with defer, html parsing is never interrupted
    script is only executed at the end
    many times this is what we want
    now why no async and defer in the body end
    don't make sense in body end, in body fetching and executing in script always happens after parsing html anyways
    async and defer have no effect in body
    
    use cases for all these strategies
    //regular loading in the head is completely ruled out

    END of body Regular
    scripts are fetched and executed after the HTML is completely parsed
    ASYNC in Head
    scripts are fetched asynchronously and executed immediately
    DEFER in Head
    scripts are fetched asynchronously and executed 
    after the HTML is completely parsed

    async v defer
    
    loading async script usually the DOMcontentLoadedEvent
waits for all scripts to execute, except for async scripts. So, DOMContentLoaded does not wait for an async script

with async domcontentloaded is fired off as soon as html finishes parsing
might happen when big script takes long to load

notice how DOMContentLoadedEvent appears right after HTML parsing
in both these diagrams

using defer forces the DOMCONTENTLOADEDEVENT to only get fired after the 
whole script has been downlaoded and executed
more traditional way that this e, works

another important aspect is that async scripts are not guaranteed to be executed in the exact order that they are declared in the code
so the script that arrives 1st gets executed 1st

using defer that is not the case

use defer attibute guarantees scripts are execute din order they are declared or written in the code

usually what we want to happen

conclusion using defer in HTML head is overall the best solution

use it for your own scripts and for scripts where order of execution is important

if script relies on some 3rd party library that u need to include
you will include that library beofre your own script so your script can then use the libraryies code
in this case u have to use defer and not async

because defer guarantees the correct order of execution

for 3rd party scripts where order does not matter
an analytic software google analytics or an ad script or something like that, this 
case u should use Async, any code that ur own code will not need to interact with async is fine

only modern browsers accept async and defer and get ignored in old browsers

if you need to support old browsers then pt script tag at the end of the body and not the head

not a JS feature but HTML5 feuture


    */
 })
////////////////////////////////

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', (e) => {
//   //get coordinates of elemt we want to scroll to
//   const s1coords = section1.getBoundingClientRect();
// //e.target is the btnScrollTo the one that was clicked
//   console.log(e.target.getBoundingClientRect());
// })
// //getBoundingClientRect is relative to this visible view port

// //we can get the current scroll position
// //these x and y values ar ein 2nd param
// console.log('Current scroll (X/Y)', window.
// pageXOffset, window.pageYOffset);
// //y coordinate is the distance btwn the current position here of the viewport and at the top of the pg
// //from learn more to the top of page is the distance for y

// console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

// //scrolling, first arg is left position
// window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset) //global function available on window obj
// //zero is good for left because we dont want any horizontal scroll
// //for 2nd one we are going to be interested in the top
// //which is again the position from the top of the viewport

// //otherway
// // window.scrollTo({
// // left: s1coords.left + window.pageXOffset,
// // top: s1coords.top + window.pageYOffset,
// // behavior: 'smooth',
// // })

// //modern way
// //take element we want to scroll to
// section1.scrollIntoView({behavior: 'smooth'})

// //an event is basically a signal that is generated by a certain DOM node
// /**
//  A signal means that something has happened, ex: click somehwere, mouse moving, user triggering
//  to full screen mode, anything of importance that happens on our webpage generates an event
//  we can then listen for these events using event listeners so that we can then handle them if we like
//  but no matter if we handle certain event or not for example click, that event
//  will always happen when a user clicks
//  so it doesnt matter if we are listening for it or not
//  that's important to understand also in the next
//  we worked with a couple of different events earlier in the course but now lets take a look at another type of event
// called mouseenter event
//  */
// //select h1 element
// const h1 = document.querySelector('h1');

// const alertH1 = function(e) {
//   //mouseenter is like hover event in css it fires w.e mouse enters a certain element
//   alert('addEventListener: Great! you are reading the heading :D')
// }
// //now we can listen for event
// h1.addEventListener('mouseenter', alertH1);
// //to prevent this from happening
// //after listening to event and handling we can then remove

// h1.removeEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1)
// , 3000);

// //list of diff events in MDN
// /**
//  important ones
//  mouse events
//  click,
//  mouseenter, mouseleave(mouse moved off element),
// mouse and keyboard are important
//  */

// //diff way of attaching event listener to event

// h1.onmouseenter =  function(e) {
//   //mouseenter is like hover event in css it fires w.e mouse enters a certain element
//   alert('addEventListener: Great! you are reading the heading :D')
// }
// //however this way of listening to events is old school
// //now we usually use addEventListener

// //2 reasons why its better
// //add multiple event listener to same event
// //older way, new function will override the first one
// //2nd advantage is we can remove an event handler incase we dont need it anymore
// //this is something we have not done before and useful
// //1st we need to export function into named function

// //3rd way of handling  events is using HTML attribute
// //this one should not be used

// //most important property of events which is capturing and bubbling phase

// //when link clicked DOM generates click event right away

// //how ever this event is actually not generated
// //at the target element (element where event happened)
// //in this case, the click on the <a></a> element
// //instead the event is generated at the root of the document
// //top of the dom tree
// //from there capturing phase happens
// /**
//  capture phasse = event travels all the way sown
//  from document root to the target element
//  as the event travels down the tree it will pass through every single parent elemenet
//  of the target element
//  as soonas event reaches target, the target phase begins
//  where events can be handled right at the target
//  as we know we do that with event listeners such as this one

//  so event listeners wait for certani event to happen on certain element and
//  as soon as the event occurs it runs the attached callback function
//  this happens in the target phase, after reach

//  this attached callback will create an alert window
//  and this happens in the target phase

//  after reaching the target the event then actually travels all the way up
//  to the document root again in the so called bubbling phase

//  events bubble up from the target to the document root
//  just like in capturing phase event passes through all its parent elements
//  and really just the parents
//  so not through any sibling elements
//  so as an event travels down and up the tree they pass through all the parent elemenets

//  why is this important?
//  if the event also happened in each of the parent element
//  so as the event bubbles through a parent element is as if the event had happened right in that very element
//  what this means is that if we attach the same event listener
//  also for example to the section element we will get the same exact
//  alert window for the section element as well

//  so we would have handled the exact same event twice

//  once at its target, and once in one of its parent element
//  and this behavior will allow us to implement really powerful patterns
//  as we will see throughout rest of section
//  this really is important to understand
//  now by default events can only be handled in the target
//  and in the bubbling phase
//  however we can set up event listeners in a way that they
//  listen to events in the capturing phase instead

//  not all types of events do have a capturing and bubbling phase
//  some of them are created right at the target element and we
//  can only handle them there
//  most events do capture and bubble such as we described
//  we can also say that events propogate which is what capturing and bubbling is
//  its events propogating from one place to another

//  */

// //attach event handlers to navigation link  and parent elements
// //click link gives background colors

// // rgb(255,255,255)
// const randomInt = (min, max) => Math.floor(Math.random()
// * (max-min+1) + min)
// const randomColor = `rgb(${randomInt(0,255)}, ${randomInt(0,255)},
// ${randomInt(0,255)})`

// console.log(randomColor(0, 255));

// document.querySelector('.nav_link').addEventListener('click',
// function(e) {
//   //in an event handler the this keyword points to element on which that event handler is attached, its going ot be a link
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   //target is essentially where the event originated
//   //where the e 1st happ, not element on which handler is attached
//   //where click happened

//   //e.currentTarget element on which event handler is attached
//   console.log(e.currentTarget === this);
//   //same, this also points ot element on hwich event listener is attached to

//   //we can stop event propagation
//   e.stopPropagation();
//   //2 parent elements now dont change background colors
//   //event never arrives to elements, because propogation stopped
//   //^not  a good idea, sometimes fix probs in complex apps, many handles same events

// })

// document.querySelector('.nav_links').addEventListener('click',
// function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// })

// document.querySelector('.nav').addEventListener('click',
// function(e) {
//   this.style.backgroundColor = randomColor()
//   console.log('NAV', e.target, e.currentTarget);
// })

// //what about capture phase
// //events are captured when they come down from doc root
// //all the way to the target, but our event handers are not picking up these events
// //during capture phase
// //addEventListener is only listening for events in the bubbling phase but not in the capturing phase
// //default behavior of addEventListener() reaosn for that capture phase
// //usually irrelevant for us, just not that useful
// //the bubbling phase can very useful for event delegation
// //if we really do want to catch e, during capturing phase
// //we can define 3rd param in addEventListener function
// //3rd param = true, the e handler will no longer listen to bubbling but instead to capturing events
// //in practice its going to look the same, but as we take a look here in our log
// //Nav appears 1st which is opposite
// //reason is this element is now actually listeninig for e, as it
// //travels down from the DOM, while other ones are listening for events
// //as it travels back up, therefore NAV is 1st to show up, because
// //this of course is 1st to happen, 1st e, travels down all the way to target
// //then bubbles back up, these other 2 e handlers here are looking
// //for bubbling e, therefore they are going to happen after this 1st one
// //now they are still working with same e, simply doing it in diff phases, of e propogation
// //

// /**
//  Now lets use the power of event bubbling to implement something called event delegation

//  */

// // How the DOM works behind the scenes
// /**
//  how is the DOM organized internally

//  DOM= interface btwn our JS code and the browser
//  more specifically HTML documents rendered in and by the browser

// //manipulating DOM helps create amazing dynamic effects

// we can use dom to make JS interact with browser

// we can create/modify/delete elements
// set styles, classes, attricutes
// listen and respond to events

// Dom tree generated from any html document

// dom tree =tree made out of nodes

// we can interact with tree

// how does interaciton work? DOM complex API
// api =application programming interface
// interface is used to programmatically interact iwht the DOM

// DOM contains tons of methods and properties used to interact with DOM tree

// querySelector, addEventListener, createElEMENT, innerHtml
// textContent, or children properties and many more

// //now in the dom there are diff types of nodes
// some nodes are html elements but others are just text
// this is really important to understand because all
// these dom methods
// and properties are organized into diff types of objects

// look at how the DOM API is organized behind scenes
// 1st every single node in dom tree is type node

// such as everything else in JS each node is represented in JS by an obbj

// node represented by js as obj

// obj gets special access to special node methods and props
// like textContent, childNodes, parentNodes, cloneNodes and many others

// there are diff types of nodes
// how should these be represented?
// this node type has a couple of child types so to say
// these are the element type, text type, commoent type, document typ

// w.e text inside any element we know it gets its own node
// <p></p>
// this node is type text

// same happens for HTML comments <!-- -->
// everything in HTML has to go in DOM as well

// for the element itself there is the element type of node
// this type of node gives each html element access to a ton of useful properties
// such as innerHTML, classList, children, or parent elements

// other useful methods = append, remove, insertAdjacentHTML
// querySelector, closest, matches, scrollIntoView, setAttribute

// each element will be represented internally as an obj
// just to make this complete the element type has internally an html element
// an HTML element child type.
// that element type itself has 1 child type for each html element
// that exists in html
// so we have a special type for buttons, for images, for links, etc
// important because each of these HTML elements can have diff unique props

// for example an img has src attricute in html which no other element has
// or anchor element for links has the href attribute which also no other element has
// so the DOM needs a way of storing these diff sttributes
// therefore diff types of html elements were created in the DOM API

// what makes all of this work is something called inheritance
// what is inheritance? = inheritance means that all the child types
// inherits methods and propertiies of all their parent node types
// for example an HTML element will get access toe verything form the elementtype like
// innerHTML or classList or these other methods and props
// besides that it will also get access to everything from the node type

// html element gets access to everything from element type
// like innerHtml, classList or other methods and props

// besides that will also get access toe verything from the node type
// cause that's also its parent type
// we can think of this as if htmlbutton element
// for example is also an element and also a node

// DOM API is broken up into these different types of nodes

// each of these types of nodes has access to diff props and methods
// and that some of them even inherit more props and methods
// from their ancestors in this organization

// the document node type
// document which we use all the time in DOM manipulation
// is infact just another type of node
// it contains important methods such as querySelector, createElement and getElementByID
// querySelector available on both document and the element types

// the DOM API needs a way of allowing all
// the node types to listen to events
// remember we usually listen for events using addEventListeners
// method on an element or the document
// why does that work?
// because there is a special node type called Eventarget which is a parent of both node type and also
// the window node type
// with this, thanks to inheritance we can call addEventListener on every node in th edom API
// all elements as well as document and window and even text and comment
// will inherit this method, therefore we will be able to use
// addEventListener() on all of them ust as if it was their own method

// to be clear we never manually create an eventTarget obj
// this is just an abstract type we dont use in practice
// this happens behind scenes to make all functionality work as we
// expect it to work
// so in a nutshell this is how the dom api works
// and is structured behind the scenes
// still simplifications here but this si what matters

//  */

// //selecting elements

// console.log(document.documentElement);

// console.log(document.head);

// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');

// console.log(allSections); //node list, contains all elemtns that are a section selected by selector

// document.getElementById('#section==1'); //id name without selector
// const allButtons = document.getElementsByTagName('button'); //all elements with the name buttons
// // all btns on pg
// //this method returns an HTML collection diff from node list
// //html colleciton is a so called life collection
// //if DOM changes then this colleciton is updated auto
// //if i remove a button, then theres only 8 elements when we had 9 before
// //we can also delete elements from dom programatically
// //this doesnt happen with node list
// //if we try to read section theres still 4 elements after deleting section node
// //this var all sections created by the timesections still existed

// document.getElementsByClassName('btn'); //no need for .
// //returns HTML collection

// //creating and inserting elements
// //insertAdjacentHtml() creates html elements
// //insertAdjacentHTML()
// //easy way to create element and use a lot
// //useful to build element from scratch, programatically with combo of some other methods

// //dom element
// const message = document.createElement('div');
// //stores element into message, element is not yet in DOM
// //this is DOM obj we can use to do something on it, not yet in DOM itself
// message.classList.add('cookie-message');
// //message.textContent = 'We use cookies for improved functionality and analytics'
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// //displayes button called Got it

// header.prepend(message);
// //prepending adds element as the 1st child of this element
// //we can also add it as last child = append
// header.append(message); //element inserted once
// //message is a life element living in dom, therefore cannot be at
// //multiple places at same time
// //same person that can't be at 2 places simultaneously
// //prepeneded element then we appended it
// //append moves element from being 1st child to last child
// //basically moves element and did not insert it because already inserted by prepend
// //we can use prepend and append mehtods not only to insert elements but also to move them
// //dom element is unique, can always only exist 1 place at a time
// //what if we wanted to insert mutltiple copies of smae elemnt
// //in case we have to copy 1st element
// // header.append(message.cloneNode(true));
// //true, all child elements will also be copied

// header.before(message); //before header element (sibling)
// header.after(message);

// //Delete elements

// document.querySelector('.btn--close-cookie').addEventListener
// ('click', () => {
//   message.remove()
//   //message.parentElement.removeChild(message); //dom traversing
// });

// //before this remove method we can only delete child elemtns
// //so back then we had to select the parent elements first
// //then remove the child from there

// //styles attributes and classes
// //styles
// message.style.backgroundColor = '#37383d'
// message.style.width = '120%'
// //inline styles is set directly into the DOM. that we manually set ourselves
// console.log(message.style.height);
// //we cannot get a style that is hidden inside of a class or that we did not set ourselves or maybe doesn't even exist

// //we can get the style if we really want to, all we need to use is the getComputedStyle()
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// //so this is the computed styles so u see computed
// //which means real style as it appears on pg and even
// //if we do not declare it in our css, browser did it
// message.style.height =
// Number.parseFloat(getComputedStyle(message).height, 10)
//  + 30 + 'px';

//  //css custom properties( or css variables)
//  //css variables similar to JS vars, we can change val many places all over css file simply chaging

//  document.documentElement.style.
//  setProperty('--color-primary', 'orangered')

//  //attributes src, alt, class, id attributes of element
//  //js we can access and change these diff attriutes
//  const logo = document.querySelector('.nav__logo');
//  console.log(logo.alt);
//  console.log(logo.src);
//  console.log(logo.className);
//  //if we add some other property that's not a standard
//  //then js will not auto create a property on the obj

//  logo.alt = 'Beautiful minimalist logo'

//  console.log(logo.designer); //undefined
//  //not standard prop expected to be on img, we made it
// //another eay of reading this val from the dom
// console.log(logo.getAttribute('designer')); // returns valeu
// console.log(logo.setAttribute('company', 'Bankist'));
// //new attribute created

// //url is diff on cl than on the html code
// //this url in cl is the absolute url while in code is
// //the relative url, relative to folder in which the index.html file is located

// //if we want the code src we have to use getAttribute
// console.log(logo.getAttribute('src'));

// //same thing with the href
// const link = document.querySelector('.twitter-link');

// link.href//both the same cause both absolute
// link.getAttribute('href');//both the same cause both absolute

// //more relavent with multiple links

// //data attributes
// //soecial kind of attributes that start with the word data
// console.log(logo.dataset.versionNumber);

// //for these special attributes, always stored in dataset obj
// //we use data attributes alot working with ui
// //specially need to store data in ui, basically in html code

// //Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); //not includes like in arrays
// //can add multiple classes, passing in multiple cals

// //DONT USE, overides existing classes, allows to only put 1 class on any eleemnt
// logo.className = 'Jonas'; //can set a class with this

/**
 Traversing the DOM

 DOM traversing is basically walking through the DOM
 means we can select an element based on another element
 important because sometimes we need to select elements relative to a certain other elements

 for ex: a direct child or a direct parent element
 or sometimes we dont know structure of the dom in runtime
 in this case we need DOM traversing

 

 */

//  const h1 = document.querySelector('h1');

//  //going downwards: child
//  //querySelector also works on elements not only on the document

//  console.log(h1.querySelectorAll('.highlight'));

//  //sometimes all we need are actually direct children
// //nodes can be text, comments, elements, etc
// //but were mostly interested in element it self

// //childnodes not used often
//  h1.childNodes //if we want text, .textContent or .innerHTML
// //used more but only works for direct children, shows only elements
//  h1.children //html collection remembers is a live collection so updated and we indeed only get 3 elements inside of h1
// //first and last element child
// h1.firstElementChild.style.color = 'white'; //only 1st child changes color
// h1.lastElementChild.style.color = 'black';

// //upwards, selecting parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //most of the time we need a parent element, which is not a direct parent
// //might need to find parent element no matter how far form the dom tree
// //for that we have closest method

// h1.closest('.header').style.background =
// 'var(--gradient-secondary)'; //selected the closest header to our h1 element
// //so closest parent element that has .header class and simply added style to that element
// //this is important especially for event delegation

// h1.closest('h1').style.background = 'var(--gradient-primary)'
// //we can think of closest as beinng the opposite of querySelector

// //both receive queryString as input but queryselector
// //finds children no matter how deep in the dom tree
// //while closest method finds parents and also no matter
// // how far off in the dom tree

// //sideways: selecting siblings
// //for some reason in JS we can only access direct siblings
// //basically only previous and the next one
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// //we have same methods/props for nodes
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //if we really need all siblings and not just previous or next one
// //use trick of moving up to parent element and then read all children form their

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(e) {
//   if(el !== h1) el.style.transform = 'scale(0.5)';
// })
