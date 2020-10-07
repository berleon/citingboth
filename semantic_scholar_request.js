
function getPaper(name) {
 // fetch('https://api.semanticscholar.org/v1/paper/URL:https://www.semanticscholar.org/paper/Restricting-the-Flow%3A-Information-Bottlenecks-for-Schulz-Sixt/987090520fa9d58a99b3d0573a5178efcf8ea4b6#citing-papers
 fetch('https://api.semanticscholar.org/v1/paper/URL:https://www.semanticscholar.org/paper/Fabricating-genetically-engineered-high-power-using-Lee-Yi/6a84672aa6a3ee40ab3e14a7f3007e23255f16be') .then(response => response.json())
  .then(data => console.log(data));
}

function getPaperByIdApi(paperId) {
    return fetch('https://api.semanticscholar.org/v1/paper/' + paperId) .then(response => response.json())
}

function renderPapersCitingBoth() {
  let url1 = document.getElementById("url1");
  let url2 = document.getElementById("url2");
  let result_list = document.getElementById("result_list");
  let result_description = document.getElementById("result_description");
  let load_spinner = document.getElementById("load-spinner");
  load_spinner.setAttribute('style', '');
  let prefix = 'https://api.semanticscholar.org/v1/paper/URL:';

  let json_prom1 = fetch(prefix + url1.value).then(response => response.json());
  let json_prom2 = fetch(prefix + url2.value).then(response => response.json());
  Promise.allSettled([json_prom1, json_prom2]).then(promises => {
      let id2ref = {}
      let papers = promises.map(elem =>   elem['value']);
      let refs_per_paper = papers.map(paper =>  paper['citations']);
      let refsIds = refs_per_paper.map(refs => refs.map(ref => ref['paperId']));
      refs_per_paper.map(refs => refs.map(ref => {id2ref[ref['paperId']] = ref}));
      console.log(refsIds[0]);
      let refIntersect = refsIds[0].filter(ref => refsIds[1].includes(ref));
      console.log(refIntersect);


      result_description.innerHTML = `
         Found <b>${refIntersect.length}</b> papers that cite:
         <ul>
            <li><b>${papers[0]['title']}</b></li>
            <li><b>${papers[1]['title']}</b></li>
         </ul>`;

      result_list.textContent = '';
      refIntersect.map(refId => {
        let ref = id2ref[refId];
        console.log(ref);
        var li = document.createElement('li');
        elem = '<a href=' + ref['url'] + '>' + ref['title'] + '</a><br> ';
        elem += ref['authors'].map(author => author['name']).join(", ");
        elem += ". In " + ref['venue'];
        elem += "  (" + ref['year'] + ")";
        li.innerHTML = elem
        result_list.appendChild(li);
      });
      load_spinner.setAttribute('style', 'display:none');
  }
  );
}
function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}

function renderAuthorPapersToHTML() {
  let author_id = document.getElementById("author_id");
  let result_list = document.getElementById("result_list");
  let prefix = 'https://api.semanticscholar.org/v1/author/';

  result_list.textContent = '';
  fetch(prefix + author_id.value).then(response => response.json()).then(data => {
      // console.log(data);
      let paper_promises = data['papers'].map((paper, idx) => {
          // console.log(paper);
          return sleep(idx*500).then(() => getPaperByIdApi(paper['paperId']))
          //getPaperByIdApi(paper['paperId'])
      });
      Promise.allSettled(paper_promises).then(promises => {
          let papers = promises.map(elem => elem['value'])
          console.log(papers)
          papers.sort((p1, p2) => p1['year'] < p2['year']);
          papers.map(paper => {
            console.log(paper);
            var li = document.createElement('li');
            elem = '<a href=' + paper['url'] + '>' + paper['title'] + '</a><br>';
            elem += paper['authors'].map(author => author['name']).join(", ") + ".";
            elem += " In " + paper['venue'];
            elem += ", " + paper['year'];
            li.innerHTML = elem
            result_list.appendChild(li);
          });
      });
  });
}
