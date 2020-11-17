<template>
    <div class="">
        <div class="text-center title-box">
            <div class="darkBg pb-4">
                <p class="pt-12 textWhite titolo">PizzaBot 3000</p>
                <v-divider class="mx-auto" color="white" width="300px"></v-divider>
                <h3 class="textWhite textFont">Fatti una pizza emozionante</h3>
            </div>

            <v-row class="mt-8" style="min-height:60px">
                <v-row class="mx-auto my-auto" style=" max-width: 800px" no-gutters>
                    <v-col cols="12" md="6" lg="3" xl="3" class="my-auto">
                        <v-btn class="foodButton mt-4 mt-lg-0" :height="!vegetables ? '40px': '60px'"
                               :style="activeColor('rgb(208, 36, 32)', vegetables)" @click="toggleVeg()">
                            <v-icon left>mdi-leaf</v-icon>
                            Verdure
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" lg="3" xl="3" class="my-auto">
                        <v-btn class="foodButton mt-4 mt-lg-0" :height="!latticini ? '40px': '60px'"
                               :style="activeColor('rgb(208, 36, 32)', latticini)" @click="toggleLact()">
                            <v-icon left>mdi-cheese</v-icon>
                            Latticini
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" lg="3" xl="3" class="my-auto">
                        <v-btn class="foodButton mt-4 mt-lg-0" :height="!meat ? '40px': '60px'"
                               :style="activeColor('rgb(208, 36, 32)', meat)" @click="toggleMeat()">
                            <v-icon left>mdi-cow</v-icon>
                            Carne
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" lg="3" xl="3" class="my-auto">
                        <v-btn class="foodButton mt-4 mt-lg-0" :height="!fish ? '40px': '60px'"
                               :style="activeColor('rgb(208, 36, 32)', fish)" @click="toggleFish()">
                            <v-icon left>mdi-fish</v-icon>
                            Pesce
                        </v-btn>
                    </v-col>
                </v-row>
            </v-row>

            <div class="my-2" style="height: 20px">
                <p v-show="!foodHint" class="textWhite hint textFont">seleziona un ingrediente</p>
            </div>

            <div class="mt-6 mx-auto">
                <div class="col-6 mx-auto ingNumberRow">
                    <label for="slider" class="text-center textWhite ingredientsNumber textFont">NUMERO INGREDIENTI:
                        {{numberOfToppings}}</label>
                    <v-slider
                            id="slider"
                            v-model="numberOfToppings"
                            max="10"
                            color="#fee119"
                            track-color="white"
                            required
                    >
                    </v-slider>
                    <div style="height:20px">
                        <p v-show="!numbHint" class="textWhite hint textFont">Quanti ingredienti vuoi?</p>
                    </div>
                </div>
            </div>

            <v-row>
                <v-btn class="mt-4 mb-6 text-center mx-auto ingredientsNumber textFont" height="70px" href="#result" :disabled="!valid"
                       color="#fee119" width="30%" style="border-radius:40px; font-weight:bold" tile
                       @click='createPizza()'>
                    Fame
                </v-btn>
            </v-row>
        </div>

        <div id="resultBackground">
            <div v-show="generated" class="container">
                <v-row id="result" class="pa-4 mx-auto pa-md-12">
                    <v-col cols="12" class="mb-12">
                        <h1 class="text-center titolo">la tua Pizza</h1>
                    </v-col>
                    <v-col cols="12" class="mx-auto pa-4 pa-lg-12 textFont ingredients">
                        <v-btn class="mb-6 text-center mx-auto textFont" height="50px"
                            color="#fee119" width="100%" style="border-radius:40px; font-weight:bold" tile
                            @click='saveJPEG()'>
                            Salva pizza
                        </v-btn>
                      <p v-if="basePizza" class="text-uppercase">Base: {{basePizza | underSpace}}</p>
                        <span class="text-uppercase text-center" v-for="item in toppingList" :key="item">
                            {{item | underSpace}} -
                        </span>
                    </v-col>
                    <v-col class="pa-12 unclickable" cols="12">
                        <canvas ref="can" width="500" height="500" style="margin: auto">
                        </canvas>

                    </v-col>
                </v-row>
            </div>
        </div>

    </div>
</template>

<script>
    import {fabric} from 'fabric';

    export default {
        name: 'Home',
        data() {
            return {
                generated: false,
                numberOfToppings: 0,
                latticini: false,
                meat: false,
                fish: false,
                vegetables: false,
                warning: false,
                base: ['pomodoro_e_mozzarella', 'bianca', 'rossa', 'bianca_bufala', 'pomodoro_e_bufala'],
                listaVerdure: ['cipolle', 'peperoni', 'melanzane', 'zucchine', 'carciofi', 'olive', 'funghi_champignon', 'patate_arrosto', 'patate_fritte',
                    'pomodorini', 'pesto', 'rucola', 'basilico'],
                listaFrutta: ['ananas', 'pere'],
                listaLatticini: ['gorgonzola', 'ricotta', 'provola', 'pecorino', 'grana', 'panna'],
                listaCarni: ['cavallo', 'wurstel', 'pancetta', 'speck', 'salame', 'salsiccia_fresca', 'guanciale', 'prosciutto_cotto',
                    'prosciutto_crudo', 'mortadella'],
                listaPesci: ['tonno', 'salmone', 'gamberi', 'gamberetti', 'surimi', 'acciughe', 'cozze', 'calamari', 'vongole'],
                listaPrioritaria:['pesto'],
                basePizza: null,
                toppingList: [],
                canvasRef: null,
                canvasInstance: null
            }
        },
        computed: {
            canvasSize () {
              return window.innerWidth.toString() + 'px'
            },
            foodHint() {
                if (this.meat || this.fish || this.vegetables || this.latticini) {
                    return true
                } else return false
            },
            numbHint() {
                if (this.numberOfToppings) {
                    return true
                } else return false
            },
            valid() {
                if (this.foodHint && this.numbHint) {
                    return true
                } else return false
            }
        },
        components: {},
        methods: {
            toggleMeat() {
                if (this.meat) {
                    this.meat = false
                } else this.meat = true
            },
            toggleFish() {
                if (this.fish) {
                    this.fish = false
                } else this.fish = true
            },
            toggleLact() {
                if (this.latticini) {
                    this.latticini = false
                } else this.latticini = true
            },
            toggleVeg() {
                if (this.vegetables) {
                    this.vegetables = false
                } else this.vegetables = true
            },
            activeColor(color, food) {
                if (food) {
                    return 'color: white; background-color :' + color
                } else return 'background-color : white'
            },
            activeIcon(food) {
                if (food) {
                    return 'color: white'
                } else return
            },

            saveJPEG() {
                //IT JUST WORKS
                let canvas = this.$refs.can;
                let multiplier = 1;
                const dataURL = canvas.toDataURL({
                    multiplier: multiplier,
                    width: canvas.width,
                    height: canvas.height,
                    left: 0,
                    top: 0,
                    format: 'jpg',
                });
                const link = document.createElement('a');
                link.download = 'canvas.png';
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },

            addImageTopping(topping, canvas) {
                setTimeout(() => {
                        var base = new Image();
                        base.crossOrigin = "Anonymous";
                        base.src = require("../../public/assets/toppings/"+topping+".png");
                        base.onload = function (img) {
                            img = new fabric.Image(base, {
                                left: 0,
                                top: 0,
                                scaleX: window.innerWidth > 576 ? 0.50 : 0.25,
                                scaleY: window.innerWidth > 576 ? 0.50 : 0.25,
                                selectable: false,
                                eventable: false,
                                src: base.src,
                                id: 0,
                            });
                            canvas.add(img);
                        }}, 200);
            },

            addImageBase(basePizza, canvas) {
                setTimeout(() => {
                        var base = new Image();
                        base.crossOrigin = "Anonymous";
                        base.src = require("../../public/assets/basi/"+basePizza+".png");

                        base.onload = function (img) {
                            img = new fabric.Image(base, {
                                left: 0,
                                top: 0,
                                scaleX: window.innerWidth > 576 ? 0.50 : 0.25,
                                scaleY: window.innerWidth > 576 ? 0.50 : 0.25,
                                selectable: false,
                                eventable: false,
                                src: base.src,
                                id: 0,
                            });
                            canvas.add(img);
                        }}, 100);
            },

            createPizza() {
                if (this.vegetables || this.meat || this.fish || this.latticini) {

                    if (!this.canvasRef && !this.canvasInstance) {
                      this.canvasRef = this.$refs.can;
                      this.canvasInstance = new fabric.Canvas(this.canvasRef);
                    }

                    //GENERAZIONE BASE RANDOM
                    var randBase = Math.floor(Math.random() * this.base.length)
                    var basePizza = this.base[randBase];
                    this.basePizza = basePizza

                    //RENDER BASE PIZZA
                    this.addImageBase(basePizza, this.canvasInstance);

                    var listaCondimenti = []
                    var condimentiGenerati = []
                    this.toppingList = []
                    this.warning = false

                    if (this.vegetables) {
                        listaCondimenti.push(...this.listaVerdure);
                        listaCondimenti.push(...this.listaFrutta);
                    }

                    if (this.meat) {
                        listaCondimenti.push(...this.listaCarni);
                    }

                    if (this.latticini) {
                        listaCondimenti.push(...this.listaLatticini);
                    }

                    if (this.fish) {
                        listaCondimenti.push(...this.listaPesci);
                    }


                    //GENERAZIONE INGREDIENTI RANDOM
                    for (i = 0; i < this.numberOfToppings; i++) {
                        var rand = Math.floor(Math.random() * listaCondimenti.length)
                        condimentiGenerati.push(listaCondimenti[rand]);
                        listaCondimenti.splice(rand, 1);
                        this.toppingList.push(condimentiGenerati[i])
                        if (this.listaPrioritaria.includes(condimentiGenerati[i]))
                        {
                            var toppingPrioritarioString = condimentiGenerati[i];
                            this.addImageTopping(toppingPrioritarioString, this.canvasInstance);
                            console.log(toppingPrioritarioString)
                        }
                    }
                    console.log(condimentiGenerati)

                    var i = 0
                    //RENDER INGREDIENTI
                    for (i = 0; i < condimentiGenerati.length; i++) {
                        if (!this.listaPrioritaria.includes(condimentiGenerati[i]))
                        {
                            var toppingString = condimentiGenerati[i];
                            this.addImageTopping(toppingString, this.canvasInstance);
                            console.log(toppingString)
                        }
                    }
                    this.generated = true
                } else this.warning = true
            }
        },
        filters: {
          underSpace (text) {
            return text.replace('_', ' ')
          }
        }
    }
</script>


<style lang="scss" scoped>
    .form {
        max-width: 50%;
    }
    .foodButton {
        border-radius: 20px;
        width: 80%;
        font-size: 26px;
        font-family: 'text', sans-serif;
        transition: 300ms;
    }

    .canvas-container {
      margin:0 auto ;
    }


    #title {
        font-size: 52px;
    }

    .customWarning {
        color: red;
    }

    .title-box {
        background: rgb(222, 37, 32);
    }

    .textWhite {
        color: white;
    }

    .ingNumberRow {
        max-width: 500px;
    }

    .darkBg {
        background: rgb(208, 36, 32);
    }

    .titolo {
        line-height: 100px;
        font-size: 120px;
        font-family: 'title', sans-serif;
        @media screen and (max-width: 980px) {
            font-size: 70px;
        }
    }

    .textFont {
        font-family: 'text', sans-serif;
    }

    .ingredientsNumber {
        font-size: 30px;
    }

    .ingredients {
        font-size: 30px;
        color: white;
        background-color: rgb(208, 36, 32);
    }

    .hint {
        font-size: 20px;
    }

    #result{
        max-width: 1200px;
    }

    .unclickable {
        background:url("../../public/assets/background.jpg");
        background-position: right;
        background-size: 100%;
        pointer-events: none
    }
</style>