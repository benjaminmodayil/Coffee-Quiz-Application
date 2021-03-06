const el = document.querySelector('[data-quiz]')

class QuizApp {
  constructor(el) {
    // this.el = el;
    this.progress = {
      score: {
        yes: 0,
        no: 0
      },
      correctQuestions: [],
      wrongQuestions: []
    }
    this.currentQuestion = 0
    //questions.length refers to the amount of questions in the other js file
    this.amtQuestions = questions.length
    this.onStart()
  }

  onStart() {
    $('.button-start').on('click', () => {
      this.clearMainContainer()
      $('aside').remove()
      this.initialFormSetup()
      this.checkAnswerHandler()
      this.onSubmitHandler()

      this.proceed()
    })
  }

  answerStatus() {
    let $inputValue
    $inputValue = $("input[type='radio']:checked").val()
    if ($inputValue === questions[this.currentQuestion - 1].correct) {
      this.progress.correctQuestions.push(questions[this.currentQuestion - 1])
      this.progress.score.yes += 1
      return true
    } else {
      this.progress.wrongQuestions.push(questions[this.currentQuestion - 1])
      this.progress.score.no += 1
      return false
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
            <button class="see-answer btn c--transparent u-float--right" type="submit">Check</button>
          </form>
        </div>
  `

    let progressTemplate = `
    <aside class="bg-c--orange">
      <div class="container-progress">
        <h2 class="c--white">Progress</h2>
        <p class="progress-meter">Correct: <span class="progress-meter--correct">0</span></p>
        <p class="progress-meter">Wrong: <span class="progress-meter--wrong">0</span></p>
        <p class="progress-meter">Remaining: 
          <span class="progress-meter--remaining">
            ${this.amtQuestions}
          </span>
        </p>
      </div>
    </aside>
    `
    $('.container-quiz__inner').append(formTemplate)
    $('.container-quiz').after(progressTemplate)
    this.onSelectionHandler()
  }

  warn() {
    let template = `
          <div class="js-warning">Click an option!</div>
        `
    let $c_fieldset = $('.question-container')
    $('.js-warning').length === 0 ? $c_fieldset.append(template) : null
  }

  clearMainContainer() {
    $('.container-quiz__inner').html('')
  }

  progressMeter() {
    let correct = $('.progress-meter--correct')
    let wrong = $('.progress-meter--wrong')
    let remaining = $('.progress-meter--remaining')

    correct.html(this.progress.correctQuestions.length)
    wrong.html(this.progress.wrongQuestions.length)
    remaining.html(this.amtQuestions - this.currentQuestion)
  }

  increment() {
    return (this.currentQuestion += 1)
  }

  proceed() {
    let $c_fieldset = $('.question-container')
    // set the counter

    // setup the data that needs to change for each question
    var legendHTML = `<legend class="question-item f-style--italic"> </legend>`
    $c_fieldset.append().html(legendHTML)
    $c_fieldset.children('legend').text(questions[this.currentQuestion].question)

    let answersHTML = questions[this.currentQuestion].options.map((item, index) => {
      let template = `
      <label class="col-half" for="question-choice-${index + 1}" tabIndex="0">
      <input type="radio" id="question-choice-${index +
        1}" name="choice" value="${item}">         
      ${item}</label>
      </div>
                    `
      return template
    })

    $('input').remove()
    $('label').remove()
    $c_fieldset.append(answersHTML)

    if (this.currentQuestion === 0) {
      this.increment()
    } else {
      this.increment()
    }
    return this.currentQuestion
  }

  onSelectionHandler(e) {
    $('fieldset').on('click', 'label', e => {
      this.labelFocusColor(e)
      $(e.currentTarget)
        .find('input')
        .attr('disabled', false)
    })

    $('fieldset').on('keyup', 'label', e => {
      if (e.which === 13 || e.which === 32) {
        $(e.currentTarget)
          .find('input')
          .prop('checked', true)
          .prop('disabled', false)
        this.labelFocusColor(e)
      }
    })
  }

  checkInput() {
    if ($('input:checked')[0] && $('input:checked')[0].checked) {
      return true
    } else {
      return false
    }
  }

  labelFocusColor(e) {
    let labels = [$('label')]
    labels.forEach(item => {
      $(item).removeClass('--is-checked')
    })

    $(e.currentTarget).addClass('--is-checked')
  }

  lockoutOptions() {
    let $inputs = $("input[type='radio']:not(:checked)")
    let $labels = $('label:not(.--is-checked)')

    // can simplify to one each loop

    $.each($labels, function(i, val) {
      $(val).addClass('--disabled')
    })
    $.each($inputs, function(i, val) {
      $(val).attr('disabled', true)
    })
  }

  checkAnswerHandler() {
    $('.check-answer').on('click', e => {
      e.preventDefault()
      let $inputValue = $("input[type='radio']:checked").val()

      if ($inputValue) {
        let resultClass =
          $inputValue === questions[this.currentQuestion].correct
            ? 'reasoning--correct'
            : 'reasoning--wrong'
        let resultText =
          $inputValue === questions[this.currentQuestion].correct
            ? 'Correct!'
            : 'Wrong. BOOM ROASTED!'
        let templating = `<div class="reasoning"><h2 class="${resultClass}">${resultText}</h2><p>${
          questions[this.currentQuestion].reason
        }</p></div>`

        this.lockoutOptions()
        $('.reasoning') ? $('.reasoning').remove() : null
        $('.container-quiz__inner').append(templating)
      }
    })
  }

  nextQuestion() {
    $('main')
      .unbind('click')
      .on('click', '.next-question', e => {
        e.preventDefault()
        window.scroll({ top: 0, left: 0, behavior: 'smooth' })
        if (this.checkInput() === true && this.currentQuestion === this.amtQuestions) {
          this.renderResults()
        } else {
          setTimeout(() => {
            $('.next-question').addClass('see-answer')
            $('.next-question').removeClass('next-question')

            $('.see-answer').text('Check')
            $('form').append($('.see-answer'))
            this.proceed()
          }, 200)
          setTimeout(() => {
            $('.reasoning') ? $('.reasoning').remove() : null
          }, 400)
          $('.progress-meter--current').html(this.currentQuestion + 1)
        }
      })
  }

  onSubmitHandler() {
    $('body')
      .unbind('click')
      .on('click', '.see-answer', e => {
        e.preventDefault()

        let $inputValue = $("input[type='radio']:checked").val()

        if ($inputValue) {
          let resultClass =
            $inputValue === questions[this.currentQuestion - 1].correct
              ? 'reasoning--correct'
              : 'reasoning--wrong'
          let resultText =
            $inputValue === questions[this.currentQuestion - 1].correct
              ? 'Correct!'
              : 'Wrong. BOOM ROASTED!'
          let templating = `<div class="reasoning"><h2 class="${resultClass}">${resultText}</h2><p>${
            questions[this.currentQuestion - 1].reason
          }</p></div>`

          this.lockoutOptions()
          $('.reasoning') ? $('.reasoning').remove() : null
          $('.container-quiz__inner').append(templating)
          setTimeout(() => {
            window.scrollBy({ top: 500, left: 0, behavior: 'smooth' })
          }, 300)

          if (this.checkInput() === true && this.currentQuestion === this.amtQuestions) {
            this.nextQuestion()

            setTimeout(function() {
              $('.see-answer').addClass('next-question')
              $('.see-answer').removeClass('see-answer')

              $('.next-question').text('Next Question')
              $('.reasoning').append($('.next-question'))
            }, 300)
            //
            this.answerStatus()
            this.progressMeter()
            //
          } else if (this.checkInput() === true) {
            this.nextQuestion()

            setTimeout(function() {
              $('.see-answer').addClass('next-question')
              $('.see-answer').removeClass('see-answer')

              $('.next-question').text('Next Question')
              $('.reasoning').append($('.next-question'))
            }, 300)
            this.answerStatus()
            this.progressMeter()
          } else {
            this.warn()
          }
        } else {
          this.warn()
        }
      })
  }

  renderResults() {
    let feedbackPT1 =
      this.progress.score.yes > 6 ? 'Nicely done! 💯' : 'Better luck next time.'
    let feedbackPT2 = this.progress.score.yes > 6 ? 'master.' : 'loser.'
    let template = `
    <div class="results-container">
      <h1>
        Your Results
      </h1>
      <h2>${feedbackPT1} ${this.progress.score.yes}/${this.amtQuestions} correct</h2>
      <p>You are truly the roast ${feedbackPT2}. 👏</p>
      <div>
        <button class="btn c--transparent button-retake">Retake quiz</button>
        <a class="btn c--blue button-share" target="_blank" href="https://twitter.com/home?status=Coffee%20quiz%20by%20%40modayilme%0Ahttps%3A//codepen.io/modayilme/project/live/24796d4c441b4db988b5b28aa5906e13/XMaOmW/">Share on <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" xml:space="preserve" width="16" height="16"><g class="nc-icon-wrapper" fill="#ffffff"><path fill="#ffffff" d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z"></path></g></svg></span></a>
      </div>
    </div>
  `
    this.clearMainContainer()
    $('.container-quiz__inner').append(template)
    this.reset()
  }

  reset() {
    $('.button-retake').on('click', () => {
      this.currentQuestion = 0
      this.progress.correctQuestions = []
      this.progress.wrongQuestions = []
      this.progress.score.yes = 0
      this.progress.score.no = 0

      this.clearMainContainer()
      $('aside').remove()
      this.initialFormSetup()
      this.onSubmitHandler()
      this.proceed()
    })
  }
}

$(new QuizApp(el))
