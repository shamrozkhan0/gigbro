const WEB_URL = "http://localhost:5173/"
const BACKEND_URL = "http://localhost:8000/"


const loginHTML = `
    <div class="row display-flex align-items-center justify-center flex-column py-50 gap-10">
        <img src="./images/gig-logo.png" alt="" class="login-gigbro-logo">
        <h2>Welcome to GigBro</h2>
        <p class="text-center text">Looks like you are not logged in </br>
         please login to continue and access all features </p>
        <button type="button" id="loginButton"><b>Login</b></button>
      </div>
    `

const scrapperHTML = `
<div class="card">
    <h1>Scrapper</h1>
 
    <div class="icon-blanket">
     <div class="icon-wrapper">
      <div class="icon-circle" id="iconCircle">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
     </div>
    </div>
 
    <p id="output">Click the scrapp button to scrap the gig</p>
      <p class="subtext" id="subtext"></p>
 
    <div class="bar-track">
      <div class="bar" id="bar"></div>
    </div>
 
    <button id="btn">Start Scrapping</button>
    <button id="logout">Logout</button>
  </div>
`


async function senddata(data) {
  const BACKEND_SAVE_DATA_URL = "http://localhost:8000/savecontent"

  const response = await fetch(BACKEND_SAVE_DATA_URL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: data.gig_url,
      seller_status: data.seller_status,
      title: data.title,
      description: data.gig_description,
      expertise: data.expertise,
      category_and_subcategory: data.gig_category,
      packages: data.packages,
      tags: data.tags,
      profile_description: data.seller_profile_description,
      ratings: data.ratings,
      total_orders: data.total_orders,
      gig_stars: data.total_stars,
      seller_information: data.seller_information,
    })

  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCRAPPED_DATA") {
    console.log("bg js:", message.data);
    senddata(message.data)
  }
});



function showModal(message, isSucess) {
  const modal = document.querySelector("div.alert-modal")
  if (isSucess) {
    modal.classList.remove("d-none")
    modal.classList.add("message")
    modal.querySelector("p.alert-modal-text").textContent = message
  } else {
    console.log("modal show red")
  }

  setTimeout(() => {
    modal.classList.add("d-none")
    modal.classList.remove("message")
    return true
  }, 3200)
}


async function isFiverTab() {

  const activeTab = { active: true, currentWindow: true };

  const [tab] = await chrome.tabs.query(activeTab);
  const url = tab.url.startsWith("https://www.fiverr.com/")


  const isLoggedIn = await fetch("http://localhost:8000/me", {
    credentials: "include"
  }).then(res => res.ok ? true : false).catch(err => {
    console.error(err)
  });

  console.log("login:", isLoggedIn)


  if (isLoggedIn) {
    if (url) {
      showScrapper()
    } else {
      const title = document.querySelector("div.container div.wrapper h1")
      title.textContent = "Not on Fiver"
    }
  } else {
    showLogin()
  }

}

isFiverTab()



async function logout() {
  await fetch(BACKEND_URL + "logout", {
    method: "POST",
    credentials: "include"
  });
  console.log("logout completed")
  showLogin()

}


// This function inject's login HTML in the extension if user is not login
const showLogin = () => {
  const container = document.querySelector("div.container").innerHTML = loginHTML;


  document.getElementById("loginButton").addEventListener("click", () => {
    chrome.tabs.create({ url: WEB_URL + "login" });
  });


  document.querySelector(".show-modal-btn").addEventListener("click", () => {
    const modal = document.querySelector("div.alert-modal")
    modal.classList.add("message")
    setTimeout(() => {
      modal.classList.remove("message")
    }, 3200);
  })

};



// This function inject's scrapper HTML in the extension if user is login
const showScrapper = () => {
  const container = document.querySelector("div.container div.wrapper");

  container.innerHTML = scrapperHTML;

  // document.getElementById("btn").addEventListener("click", async () => {
  //   try {
  //     console.log("button is clicked")
  //     const [tab] = await chrome.tabs.query({
  //       active: true,
  //       currentWindow: true
  //     });

  //     await chrome.scripting.executeScript({
  //       target: { tabId: tab.id },
  //       files: ["dist/scrapper.js"]
  //     })
  //   }

  //   catch (error) {
  //     console.error("Error: ", error)
  //   }

  // console.log("content is scrapped", isScrapped)
  // if (isScrapped.status){
  //   let url = WEB_URL + isScrapped.user_id + "/" + isScrapped.content_id
  //   console.log(url)
  //  setTimeout(()=>{
  //   //  chrome.tabs.create({ url: url }); 
  //  },3200)
  // }
  // });

  // Logout Button
  document.getElementById("logout").addEventListener("click", () => {
    logout()
  })



  const btn = document.getElementById('btn');
  const logoutBtn = document.getElementById('logout');
  const bar = document.getElementById('bar');
  const output = document.getElementById('output');
  const subtext = document.getElementById('subtext');
  const iconCircle = document.getElementById('iconCircle');
  const iconBlanket = document.querySelector(".icon-blanket")

  let scraping = false;

  function resetUI() {
    bar.style.width = '0%';
    output.textContent = 'Click the scrapp button to scrap the gig';
    subtext.textContent = '';
    iconCircle.classList.remove('show');
    iconBlanket.classList.remove("show");
  }

  btn.addEventListener('click', () => {
    if (scraping) return;
    scraping = true;

    btn.disabled = true;
    btn.textContent = 'Scrapping...';
    iconCircle.classList.remove('show');
    iconBlanket.classList.remove("show");
    output.textContent = 'Scraping in progress...';
    subtext.textContent = '';
    bar.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 7;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        bar.style.width = '100%';
        output.textContent = 'Gig Scraped Successfully!';
        subtext.textContent = 'Redirecting for analysis...';
        iconCircle.classList.add('show');
        iconBlanket.classList.add('show');

        btn.disabled = false;
        btn.textContent = 'Start Scrapping';
        scraping = false;
      } else {
        bar.style.width = progress + '%';
      }
    }, 250);

    setTimeout(() => {
        chrome.tabs.create({ url: WEB_URL + "dashboard" });
    }, 500);

  });




};
