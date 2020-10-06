
function getPaper(name) {
 // fetch('https://api.semanticscholar.org/v1/paper/URL:https://www.semanticscholar.org/paper/Restricting-the-Flow%3A-Information-Bottlenecks-for-Schulz-Sixt/987090520fa9d58a99b3d0573a5178efcf8ea4b6#citing-papers
 fetch('https://api.semanticscholar.org/v1/paper/URL:https://www.semanticscholar.org/paper/Fabricating-genetically-engineered-high-power-using-Lee-Yi/6a84672aa6a3ee40ab3e14a7f3007e23255f16be') .then(response => response.json())
  .then(data => console.log(data));
}
function getPapers() {
  let url1 = document.getElementById("url1");
  let url2 = document.getElementById("url2");
  let result_list = document.getElementById("result_list");
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

      result_list.textContent = '';
      refIntersect.map(refId => {
        let ref = id2ref[refId];
        console.log(ref);
        var li = document.createElement('li');
        elem = '<a href=' + ref['url'] + '>' + ref['title'] + '</a><br>by ';
        elem += ref['authors'].map(author => author['name']).join(", ");
        li.innerHTML = elem
        result_list.appendChild(li);
      });
  }
  );
}
