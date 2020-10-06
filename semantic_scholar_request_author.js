function getPaperToHTML() {
  let author_id = document.getElementById("author_id");
  let result_list = document.getElementById("result_list");
  let prefix = 'https://api.semanticscholar.org/v1/author/';

  fetch(prefix + author_id.value).then(response => response.json()).then(data => {
      console.log(data);
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
