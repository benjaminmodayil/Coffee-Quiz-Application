let currentQuestion = 0;
let amtQuestions = questions.length;

let progress = {
  score: {
    yes: 0,
    no: 0
  },
  correctQuestions: [],
  wrongQuestions: []
};

const el = document.querySelector("[data-quiz]");

class QuizApp {
  constructor(el) {
    // this.el = el;
    this.onStart();
  }

  onStart() {
    $(".button-start").on("click", () => {
      this.clearMainContainer();
      $("aside").remove();
      this.initialFormSetup();
      this.checkAnswerHandler();
      this.onSubmitHandler();

      this.proceed();
      
    });
  }

  answerStatus() {
    let $inputValue;
    $inputValue = $("input[type='radio']:checked").val();
    if ($inputValue === questions[currentQuestion - 1].correct) {
      progress.correctQuestions.push(questions[currentQuestion - 1]);
      progress.score.yes += 1;
      return true;
    } else {
      progress.wrongQuestions.push(questions[currentQuestion - 1]);
      progress.score.no += 1;
      return false;
    }
  }

  initialFormSetup() {
    let formTemplate = `
      <div class="container-form">
          <form method="post" action="">
          <p class="c--orange progress-meter-alt">Question: <span class="progress-meter--current f-weight--bold">1</span></p>
            
            <fieldset class="question-fieldset" data-num="1">
              <div class="question-container">

              </div>
            </fieldset>
            <button class="see-answer btn c--transparent u-float--right" type="submit">Next</button>
          </form>
        </div>
  `;

    let progressTemplate = `
    <aside class="bg-c--orange">
      <div class="container-progress">
        <h2 class="c--white">Progress</h2>
        <p class="progress-meter">Correct: <span class="progress-meter--correct">0</span></p>
        <p class="progress-meter">Wrong: <span class="progress-meter--wrong">0</span></p>
        <p class="progress-meter">Remaining: 
          <span class="progress-meter--remaining">
            ${amtQuestions}
          </span>
        </p>
      </div>
    </aside>
    `;
    $(".container-quiz__inner").append(formTemplate);
    $(".container-quiz").after(progressTemplate);
    this.onSelectionHandler();
  }

  warn() {
    let template = `
          <div class="js-warning">Click an option!</div>
        `;
    let $c_fieldset = $(".question-container");
    $(".js-warning").length === 0 ? $c_fieldset.append(template) : null;
  }

  clearMainContainer() {
    $(".container-quiz__inner").html("");
  }

  progressMeter() {
    let correct = $(".progress-meter--correct");
    let wrong = $(".progress-meter--wrong");
    let remaining = $(".progress-meter--remaining");

    correct.html(progress.correctQuestions.length);
    wrong.html(progress.wrongQuestions.length);
    remaining.html(amtQuestions - (currentQuestion));

  }

  increment() {
    return (currentQuestion += 1);
  }

  proceed() {
    let $c_fieldset = $(".question-container");
    // set the counter

    // setup the data that needs to change for each question
    var legendHTML = `<legend class="question-item f-style--italic"> </legend>`;
    $c_fieldset.append().html(legendHTML);
    $c_fieldset.children("legend").text(questions[currentQuestion].question);

    let answersHTML = questions[currentQuestion].options.map((item, index) => {
      let template = `
      <label class="col-half" for="question-choice-${index + 1}" tabIndex="1">
      <input type="radio" id="question-choice-${index +
        1}" name="choice" value="${item}">         
      ${item}</label>
      </div>
                    `;
      return template;
    });

    $("input").remove();
    $("label").remove();
    $c_fieldset.append(answersHTML);

    if (currentQuestion === 0) {
      this.increment();
    } else {this.increment();}
    return currentQuestion;
  }

  onSelectionHandler(e) {
    $("fieldset").on("click", "label", e => {
      this.labelFocusColor(e);
      $(e.currentTarget)
        .find("input")
        .attr("disabled", false);
    });

    $("fieldset")
      .on("keyup", "label", (e) => {
        if (e.which === 13 || e.which === 32) {
          $(e.currentTarget)
            .find("input")
            .prop("checked", true)
            .prop("disabled", false);
          this.labelFocusColor(e);
        }
      })
  }

  checkInput() {
    if ($("input:checked")[0] && $("input:checked")[0].checked) {
      return true;
    } else {
      return false;
    }
  }

  labelFocusColor(e) {
    let labels = [$("label")];
    labels.forEach(item => {
      $(item).removeClass("--is-checked");
    });

    $(e.currentTarget).addClass("--is-checked");
  }

  lockoutOptions() {
    let $inputs = $("input[type='radio']:not(:checked)");
    let $labels = $("label:not(.--is-checked)");

    // can simplify to one each loop

    $.each($labels, function(i, val) {
      $(val).addClass("--disabled");
    });
    $.each($inputs, function(i, val) {
      $(val).attr("disabled", true);
    });
  }

  checkAnswerHandler() {
    $(".check-answer").on("click", e => {
      e.preventDefault();
      let $inputValue = $("input[type='radio']:checked").val();

      if ($inputValue) {
        let resultClass =
          $inputValue === questions[currentQuestion].correct
            ? "reasoning--correct"
            : "reasoning--wrong";
        let resultText =
          $inputValue === questions[currentQuestion].correct
            ? "Correct!"
            : "Wrong. BOOM ROASTED!";
        let templating = `<div class="reasoning"><h2 class="${resultClass}">${resultText}</h2><p>${
          questions[currentQuestion].reason
        }</p></div>`;

        this.lockoutOptions();
        $(".reasoning") ? $(".reasoning").remove() : null;
        $(".container-quiz__inner").append(templating);
      }
    });
  }

  nextQuestion() {
    $("main").unbind('click').on("click", ".next-question", (e) => {
      e.preventDefault();
      document.querySelector('.progress-meter-alt').scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        $(".next-question").addClass("see-answer");
        $(".next-question").removeClass("next-question");
        this.proceed();        
      }, 200)
      setTimeout(() => {
        $(".reasoning") ? $(".reasoning").remove() : null;
      }, 500)
        $('.progress-meter--current').html(currentQuestion + 1);
    });
  }

  onSubmitHandler() {
    $('body').unbind('click').on("click", '.see-answer', e => {
      e.preventDefault();

      let $inputValue = $("input[type='radio']:checked").val();

      if ($inputValue) {
        let resultClass =
          $inputValue === questions[currentQuestion - 1].correct
            ? "reasoning--correct"
            : "reasoning--wrong";
        let resultText =
          $inputValue === questions[currentQuestion - 1].correct
            ? "Correct!"
            : "Wrong. BOOM ROASTED!";
        let templating = `<div class="reasoning"><h2 class="${resultClass}">${resultText}</h2><p>${
          questions[currentQuestion - 1].reason
        }</p></div>`;

        this.lockoutOptions();
        $(".reasoning") ? $(".reasoning").remove() : null;
        $(".container-quiz__inner").append(templating);
        setTimeout(() => {
          document.querySelector('.reasoning').scrollIntoView({ behavior: 'smooth' });
        }, 300)

        if (
          this.checkInput() === true &&
          currentQuestion === amtQuestions
        ) {

          this.nextQuestion();

          setTimeout(function() {
            $('.see-answer').addClass('next-question');
            $('.see-answer').removeClass('see-answer');
          }, 300)
          //
          this.answerStatus();
          this.renderResults();
          this.progressMeter();
          //
        } else if (this.checkInput() === true) {

          this.nextQuestion();

         setTimeout(function() {
            $('.see-answer').addClass('next-question');
            $('.see-answer').removeClass('see-answer');

          }, 300)
          this.answerStatus();
          this.progressMeter();
        } else {
          this.warn();
        }
      }
    });
  }

  renderResults() {
    let feedbackPT1 =
      progress.score.yes > 6 ? "Nicely done! 💯" : "Better luck next time.";
    let feedbackPT2 = progress.score.yes > 6 ? "master." : "loser.";
    let template = `
    <h1>
      Your Results
    </h1>
    <h2>${feedbackPT1} ${progress.score.yes}/${amtQuestions} correct</h2>
    <p>You are truly the roast ${feedbackPT2}. 👏</p>
    <div>
      <button class="btn c--transparent button-retake">Retake quiz</button>
      <a class="btn c--blue button-share" target="_blank" href="https://twitter.com/home?status=Coffee%20quiz%20by%20%40modayilme%0Ahttps%3A//codepen.io/modayilme/project/live/24796d4c441b4db988b5b28aa5906e13/XMaOmW/">Share on 🐦</a>
    </div>
  `;
    this.clearMainContainer();
    $(".container-quiz__inner").append(template);
    this.reset();
  }

  reset() {
    $(".button-retake").on("click", () => {
      currentQuestion = 0;
      progress.correctQuestions = [];
      progress.wrongQuestions = [];
      progress.score.yes = 0;
      progress.score.no = 0;

      this.clearMainContainer();
      $("aside").remove();
      this.initialFormSetup();
      this.onSubmitHandler();
      this.proceed();
    });
  }
}

$(new QuizApp(el));