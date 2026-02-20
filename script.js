const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const result = document.getElementById("result");

searchBtn.addEventListener("click", getUser);

async function getUser() {

  const username = usernameInput.value.trim();

  if (username === "") {
    alert("Please enter username");
    return;
  }

  result.innerHTML = "Loading...";

  try {

    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();

    if (data.message === "Not Found") {
      result.innerHTML = "User not found";
      return;
    }

    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
    );

    const repos = await repoRes.json();


    showUser(data, repos);

  } catch (error) {
    result.innerHTML = "Something went wrong";
    console.log(error);
  }

}

function showUser(user, repos) {

  let repoHTML = "";

  if (repos.length === 0) {
    repoHTML = "<p>No repositories found</p>";
  } else {

    repos.forEach((repo) => {

      repoHTML += `
        <li>
          <a href="${repo.html_url}">
            ${repo.name}
          </a>
          ${repo.stargazers_count}
          (${repo.language || "--"})
        </li>
      `;

    });

  }

  result.innerHTML = `
    <div class="card">

      <img src="${user.avatar_url}" alt="profile">

      <h2>${user.name || "No Name"}</h2>
      <p>@${user.login}</p>

      <p>${user.bio || "No bio available"}</p>

      <p>Repos: ${user.public_repos}</p>
      <p>Followers: ${user.followers}</p>

      <a href="${user.html_url}" target="_blank">
        View Profile
      </a>

      <h3 style="margin-top:15px;">Latest Repositories</h3>

      <ul style="list-style:none; padding:0;">
        ${repoHTML}
      </ul>

    </div>
  `;
}