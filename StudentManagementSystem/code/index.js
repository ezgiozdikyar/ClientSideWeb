let pageSize = 8;
let curPage = 1;
let studentsData;
let numberOfPages;
const studentForm = document.querySelector(".table");

window.addEventListener('DOMContentLoaded', () => renderFullPage());

const renderFullPage = async () => {
  await getData();
  setNumberOfPages();
  renderStudents();
  displayPageNumbers();
}

const renderStudents = async () => {
  var template = `<thead>
    <tr class="d-flex pl-5">
        <th class="col-sm-6 col-md-4 col-lg-3">İsim Soyisim</th>
        <th class="d-none d-md-block col-md-4 col-lg-3">Öğrenci Numarası</th>
        <th class="d-none d-lg-block col-lg-3">Bölüm</th>
        <th class="col-sm-6 col-md-4 col-lg-3">Yetkiler</th>
    </tr>
    </thead>`;
  studentsData.filter((row, index) => {
    let start = (curPage - 1) * pageSize;
    let end = curPage * pageSize;
    if (index >= start && index < end) return true;

  }).forEach(student => {
    let department = student.dept;
    template += `
        <tr class="d-flex pl-5">
        <td class="col-sm-5 col-md-4 col-lg-3">${student.fname} ${student.lname}</td>
        <td class="d-none d-md-block col-md-3">${student.num}</td>
        <td class="d-none d-lg-block col-lg-2 col-xl-3">${depts[department]}</td>
        <td class="col-sm-7 col-md-5 col-lg-4 col-xl-3">
        <button id="btn-delete" class="btn btn-danger" onClick = "deleteStudentModal(${student.id})">Sil</button>
        <button class="btn btn-primary" onClick= "updateStudent(${student.id})">Düzenle</button>
        <button class="btn btn-success" onClick="showDetails(${student.id})">Detay</button>
        </td>
        </tr>
        `
  });
  studentForm.innerHTML = template;
}

function setPageSize(value, element) {
  let buttons = document.querySelectorAll(".page-size-buttons");
  buttons.forEach(button => {
    if (button.classList.contains('active'))
      button.classList.remove('active');
  })
  element.classList.add("active");
  pageSize = value;
  setNumberOfPages();
  displayPageNumbers();
  setCurrentPage();
  renderStudents();
}

const getData = async () => {
  let uri = 'http://localhost:3000/students';
  const res = await fetch(uri);
  studentsData = await res.json();
}
function setNumberOfPages() {
  numberOfPages = Math.ceil(studentsData.length / pageSize);
}

function displayPageNumbers() {
  let pageNumbers = document.querySelector("#page-numbers");
  pageNumbers.innerHTML = '';
  pageNumbers.innerHTML += `<button class="btn btn-outline-primary page-number-buttons ml-2 active" onclick = "setCurrentPage(${1})">${1} </button>`
  for (let i = 2; i < numberOfPages + 1; i++) {
    pageNumbers.innerHTML += `<button class="btn btn-outline-primary page-number-buttons ml-2" onclick = "setCurrentPage(${i})">${i} </button>`
  }
}
function setCurrentPage(value) {
  curPage = value;
  if (isNaN(curPage)) curPage = numberOfPages;
  let buttons = document.querySelectorAll(".page-number-buttons");
  let pageNumbersContent = document.querySelector("#page-numbers-content");

  buttons.forEach(button => {
    if (button.classList.contains('active'))
      button.classList.remove('active');
    if (button.textContent == curPage)
      button.classList.add('active');
  })
  pageNumbersContent.innerHTML = `${studentsData.length} öğrenciden ${((curPage - 1) * pageSize) + 1} - ${(curPage*pageSize > studentsData.length ? studentsData.length : curPage*pageSize)} arası gösteriliyor.`
  renderStudents();
}

function showDetails(studentId) {
  let student = returnStudent(studentId);

  let studentInfo = `
    <div class="modal fade" id="details-modal" tabindex="-1" aria-labelledby="exampleModalLabel">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"><i class="bi bi-info-circle-fill mr-2" style="color:blue"></i>Öğrenci Bilgileri</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body" id="show-student">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
 
  let detailsModal = document.createElement('div');
  detailsModal.innerHTML = studentInfo;
  document.body.appendChild(detailsModal);

  document.querySelector("#show-student").innerHTML = `
    <form>
    <div class="row">
      <div class="col-12 col-md-6 mt-1">
        <label for="recipient-name" class="col-form-label p-0">İsim</label>
        <span class="form-control mr-2 mt-1">${student.fname}</span>
      </div>
      <div class="col-12 col-md-6 mt-1">
      <label for="message-text" class="col-form-label p-0">Soyisim</label>
        <span class="form-control mt-1">${student.lname}</span>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 mt-1">
        <label for="recipient-name" class="col-form-label p-0">Öğrenci Numarası</label>
        <span class="form-control mr-2 mt-1">${student.num}</span>
      </div>
      <div class="col-12 col-md-6 mt-1">
        <label for="message-text" class="col-form-label p-0">Bölüm</label>
        <span class="form-control  mt-1">${depts[student.dept]}</span>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 mt-1">
        <label for="recipient-name" class="col-form-label col-6 p-0">Doğum Yeri</label>
        <span class="form-control mr-2  mt-1">${student.pob}</span>
      </div>
      <div class="col-12 col-md-6 mt-1">
        <label for="message-text" class="col-form-label col-6 p-0">Doğum Tarihi</label>
        <span class="form-control  mt-1">${student.dob}</span>
      </div>
    </div>
    </form>` ;

  $('#details-modal').modal({ show: true });
}

function addStudent() {
    $('#modal-add').modal({ show: true });
    $("#form-add").on("submit", function (e){
    e.preventDefault();
    let firstname = document.getElementById("input-fname").value;
    console.log(firstname);
    let lastname = document.getElementById("input-lname").value;
    let number = document.getElementById("input-no").value;
    let depart = document.getElementById("input-dept").value;
    let placeob = document.getElementById("input-pob").value;
    let dateob = document.getElementById("input-dob").value;
  
    const studentToAdd = {
      fname:firstname,
      lname:lastname,
      num:number,
      dept:depart,
      pob:placeob,
      dob:dateob,
    } 
    if($('#form-add')[0].checkValidity()){
        fetch('http://localhost:3000/students', {
        method:'POST',
        body:JSON.stringify(studentToAdd),
        headers: {'Content-Type': 'application/json'}
      });
    }
  }); 
}

function updateStudent(studentId){
  let student = returnStudent(studentId);
  let studentInfo = `
  <div class="modal fade" id="modal-update" tabindex="-1" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel"><i class="bi bi-info-circle-fill mr-2" style="color:blue"></i>Öğrenciyi Düzenle</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body" id="update-student">
        </div>
      </div>
    </div>
  </div>`;
  let updatesModal = document.createElement('div');
  updatesModal.innerHTML = studentInfo;
  document.body.appendChild(updatesModal);

  document.querySelector("#update-student").innerHTML = `
  <form id="form-update">
          <div class="row">
            <div class="col-12 col-md-6 mt-1">
              <label for="recipient-name" class="col-form-label p-0">İsim</label>
              <input type="text" pattern="[A-Za-zŞşÇçİÜüĞğÖöı]{3,}" value="${student.fname}" class="form-control mr-2 mt-1" id="update-fname" required>
               <div class="invalid-feedback">İsim en az 3 harf içermelidir.</div>
            </div>
            <div class="col-12 col-md-6 mt-1">
              <label for="message-text" class="col-form-label p-0">Soyisim</label>
              <input type="text"  pattern="[A-Za-zŞşÇçİÜüĞğÖöı]{3,}" value="${student.lname}" class="form-control mr-2 mt-1" id="update-lname" required>
              <div class="invalid-feedback">Soyisim en az 3 harf içermelidir.</div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6 mt-1">
              <label for="recipient-name" class="col-form-label p-0">Öğrenci Numarası</label>
              <input type="number" class="form-control mr-2 mt-1" value="${student.num}" id="update-no" maxlength="12" minlength="12"required>
              <div class="invalid-feedback">Öğrenci numarası 12 basamaktan oluşmalıdır.</div>
            </div>
            <div class="col-12 col-md-6 mt-1">
              <label for="message-text" class="col-form-label p-0">Bölüm</label>
              <select class="custom-select form-select mt-2" id="update-dept" required>
                <option value="" selected>${depts[student.dept]}</option>
                <option value="1">Bilgisayar Müh.</option>
                <option value="2">Elektrik-Elektronik Müh.</option>
                <option value="3">Endüstri Müh.</option>
                <option value="4">İnşaat Müh.</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6 mt-1">
              <label for="recipient-name" class="col-form-label col-6 p-0">Doğum Yeri</label>
              <input type="text" pattern="[A-Za-zŞşÇçİÜüĞğÖöı]{3,}" value="${student.pob}" class="form-control mr-2 mt-2" id="update-pob" aria-describedby="validationServer03Feedback" required>
              <div class="invalid-feedback">Doğum yeri en az 3 harf içermelidir.</div>
            </div>
            <div class="col-12 col-md-6 mt-1">
              <label for="message-text" class="col-form-label col-6 p-0">Doğum Tarihi</label>
              <input type="date" value="${student.dob}" class="form-control mr-2 mt-2" id="update-dob" required>
              <div class="invalid-feedback">Lütfen bir tarih seçiniz.</div>
            </div>
          </div>
          <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Vazgeç</button>
          <button id="btn-update" type="submit" class="btn btn-primary">Onayla</button>
         </div>
          </form>
         
  `
  $('#modal-update').modal({ show: true });

  const updateForm = document.querySelector('#form-update');

  updateForm.addEventListener('submit',function(e){
    e.preventDefault();
    let firstname = document.getElementById("update-fname").value;
    console.log(firstname);
    let lastname = document.getElementById("update-lname").value;
    let number = document.getElementById("update-no").value;
    let depart = document.getElementById("update-dept").value;
    let placeob = document.getElementById("update-pob").value;
    let dateob = document.getElementById("update-dob").value;
  
    const studentToUpdate = {
      fname:firstname,
      lname:lastname,
      num:number,
      dept:depart,
      pob:placeob,
      dob:dateob,
    } 
     fetch('http://localhost:3000/students/'+ studentId, {
      method:'PUT',
      body:JSON.stringify(studentToUpdate),
      headers: {'Content-Type': 'application/json'}
    });
  });
}
function deleteStudentModal(studentId){
  let student = returnStudent(studentId);
  let template=`  
  <div class="modal fade" id="modal-delete" tabindex="-1" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel"> <i class="bi bi-exclamation-triangle-fill mr-1" style="color:red"></i> Öğrenci Sil</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body" id="delete-student">
          <div>${student.fname} ${student.lname} isimli öğrenciyi silmek üzeresiniz. Bu işlem geri alınamaz. Devam etmek
           istediğinize emin misiniz?</div>
          <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Vazgeç</button>
          <button id="modal-delete-btn" type="button" class="btn btn-danger" onClick="deleteStudent(${studentId})" >Sil</button>
        </div>
      </div>
    </div>
  </div>`
  let deleteModal = document.createElement('div');
  deleteModal.innerHTML = template;
  document.body.appendChild(deleteModal);
  $('#modal-delete').modal({ show: true });
}

function deleteStudent(studentId) {
   fetch('http://localhost:3000/students/'+ studentId, {
    method:'DELETE'
  }).then(function(response){
    console.log(response)
  }).catch(function(e){
    console.log(e);
  });
}

function returnStudent(studentId){
  let student;
  studentsData.map(x => {
    if (x.id == studentId)
      student = x;
  });
  return student;
}
