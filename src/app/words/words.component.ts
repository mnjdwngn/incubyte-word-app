import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css'],
})
export class WordsComponent implements OnInit {
  allWords: any;
  selectedWord = '';
  id: number;
  buttonType = 'Save';
  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.fetchWords();
  }

  fetchWords() {
    this.http
      .get('http://localhost:8080/words')
      .pipe(
        tap((words) => {
          this.allWords = words;
          console.log('allWords');
          console.log(words);
        })
      )
      .subscribe();
  }

  open(content, word) {
    if (word) {
      this.selectedWord = word.word;
      this.id = word.id;
      console.log(this.selectedWord);
      this.buttonType = 'Update';
    } else {
      this.selectedWord = null;
      this.id = null;
      this.buttonType = 'Save';
    }
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  saveWord() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    if (this.buttonType == 'Save') {
      let word = {
        word: this.selectedWord
      };

      this.http
      .post('http://localhost:8080/word', JSON.stringify(word), {
        headers: headers,
      })
      .pipe(
        tap((isSuccess) => {
          console.log('isSuccess');
          console.log(isSuccess);
        })
      )
      .subscribe();
      alert("Saved Successfully.")
      setTimeout(()=>{ this.fetchWords}, 2000)
    } else {
      let word = {
        id: this.id,
        word: this.selectedWord
      };

      this.http
      .put('http://localhost:8080/word', JSON.stringify(word), {
        headers: headers,
      })
      .pipe(
        tap((isSuccess) => {
          console.log('isSuccess');
          console.log(isSuccess);
        })
        
      )
      .subscribe()
      alert("Updated Successfully.")
      
    }
    setTimeout(()=>{ this.fetchWords()}, 2000)
  }

  deleteWord(id) {
    this.http
      .get('http://localhost:8080/words/'+id)
      .pipe(
        tap((response) => {
          console.log('response');
          console.log(response);
        })
      )
      .subscribe();
    
      alert("Deleted Successfully.")
      setTimeout(()=>{ this.fetchWords()}, 2000)
  }
}
