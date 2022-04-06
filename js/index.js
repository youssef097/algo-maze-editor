const sets = document.getElementById("settings")
let c = document.querySelector("canvas")
let ctx = c.getContext("2d")
let active = document.getElementById("DFS");

var mousePressed = false;
c.width = 720
c.height = 720
var size = 20
var cellSize = c.height / size
const mousePosition = { x: null, y: null }
const VELOCITY = 30;
var SEARCH_METHOD = "DFS"


var cells = []
class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j
        this.width = c.width / size
        this.height = c.height / size
        this.x = j * this.height
        this.y = i * this.height
        this.wall = false;
        this.visited = false;
        this.start = false;
        this.end = false;
        this.draw()
    }

    draw() {
        ctx.strokeStyle = "rgba(0,0,0,.2)"
        if (!this.wall) {
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
        ctx.fillStyle = this.color || this.getColor();
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    checkToPaint() {
        let { x, y } = mousePosition
        if (
            x > this.x && x < this.x + this.width
            && y > this.y && y < this.y + this.height
        ) {
            if (mousePressed && !this.visited && !this.start && !this.end) {
                this.wall = true
            }
        }
    }

    getColor() {
        if (this.wall == true) return "#1d3557"
        if (this.start == true) return "blue"
        if (this.end == true) return "#e63946"
        if (this.visited == true) return "#a8dadc"
        return "white"
    }
}

mount();

var q = []
var stack = []
let found = false
let root;
let startSearching = false;

let current
async function mainLoop() {
    ctx.clearRect(0, 0, c.width, c.height)

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            cells[i][j].draw()
        }
    }



    
    if (!found && startSearching) {
        await new Promise(r => setTimeout(r, 1));
        switch (SEARCH_METHOD) {
            case "BFS":
                BFS()
                break;
            case "DFS":
                DFS()
                break;
        }
    }



    function DFS() {

        const { i, j } = current
        if (found) {
            return null;
        }
        let possible = []

        if (i > 0 && j > 0 && i < size - 1 && j < size - 1) {
            let adj = {
                top: cells[i - 1][j] || null,
                left: cells[i][j - 1] || null,
                bot: cells[i + 1][j] || null,
                right: cells[i][j + 1] || null
            }

            let { top, bot, left, right } = adj

            if (top.end || left.end || bot.end || right.end) {
                found = true
            };

            for (const key in adj) {
                let neig = adj[key]
                if (neig && !neig.visited && !neig.wall) {
                    possible.push(adj[key])
                }
            }
        }

        let next = possible[Math.floor(Math.random() * possible.length)]

        current.visited = true;
        

        if (next) {
            if (current.end) return;
            current.color = current.start || current.end ? null : "#ffd166"

            current = next
            stack.push(current)

        } else if (stack.length) {
            let popped = stack.pop()
            popped.color = null
            current = stack[stack.length - 1]
        } else {
            cancelAnimationFrame(myReq)
        }
        if (stack.length) {
            stack[stack.length - 1].color = "#e76f51"
        }
    }


    myReq = requestAnimationFrame(mainLoop)
}

var myReq = requestAnimationFrame(mainLoop)


function BFS() {
    if (!q.length > 0) return;
    let current = q.shift()
    const { i, j } = current
    let bot, right, left, top;


    if (i > 0 && j > 0) {
        top = cells[i - 1][j] || null
        left = cells[i][j - 1] || null

        if (top.end || left.end) {
            found = true
        };
        if (left && left.visited == false && !left.wall) {
            left.visited = true;
            q.push(left)
        }
        if (top && top.visited == false && !top.wall) {
            top.visited = true;
            q.push(top)
        }
    }

    if (i < size - 1 && j < size - 1) {
        bot = cells[i + 1][j] || null
        right = cells[i][j + 1] || null
        if (bot.end || right.end) {
            found = true
        };
        if (right && right.visited == false && !right.wall) {
            right.visited = true;
            q.push(right)
        }

        if (bot && bot.visited == false && !bot.wall) {
            bot.visited = true;
            q.push(bot)
        }
    }


}




c.addEventListener("mousemove", (e) => {
    mousePosition.x = e.clientX - e.target.offsetLeft
    mousePosition.y = e.clientY - e.target.offsetTop
    let { x, y } = mousePosition

    let i = Math.floor(y / cellSize)
    let j = Math.floor(x / cellSize)
    if (mousePressed) {
        cells[i][j].wall = true
    }
})
c.addEventListener("mousedown", (e) => {
    mousePressed = true;
})
c.addEventListener("mouseup", (e) => {
    mousePressed = false;
})
c.addEventListener("click", (e) => {

    let { x, y } = mousePosition
    let i = Math.floor(y / cellSize)
    let j = Math.floor(x / cellSize)
})





sets.addEventListener("click", (e) => {
    let { id } = e.target
    if (active) {
        active.className = ""
    }
    active = e.target




    switch (id) {
        case "DFS":
            this.setMethod("DFS")
            active.className = "active"
            break;
        case "BFS":
            active.className = "active"
            this.setMethod("BFS")
            break;
        case "clear":
            clear()
            break;
        case "save":
            save()
            break;
        case "importMaze":
            importLevel()
            break;
        case "50":
            if (e.target.innerText == "50x50") {
                e.target.innerText = "20x20"
                size = 50
            } else {
                e.target.innerText = "50x50"
                size = 20
            }
            startSearching = false;
            cells = []
            mount();
            clear()

            break;
        default:
            console.log("nothing");
            break;

    }
    e.target.blur();
    console.log(id);
})




let hasStart, hasEnd;
document.addEventListener("keydown", (e) => {

    let { x, y } = mousePosition
    let i = Math.floor(y / cellSize)
    let j = Math.floor(x / cellSize)
    if (e.key == " ") {
        if (hasStart && hasEnd)
            startSearching = !startSearching;
    }
    if (e.key == "s" && !hasStart) {
        if (!cells[i][j].wall) {
            cells[i][j].start = true;
            hasStart = true;
            root = cells[i][j]
            q.push(root)
            current = root

        }
    }
    if (e.key == "e" && !hasEnd) {
        hasEnd = true;
        if (!cells[i][j].wall && !cells[i][j].start) {
            cells[i][j].end = true
        }
    }
    if (e.key == "x") {
        if (cells[i][j].wall) {
            cells[i][j].wall = false
        }
    }


})







function save() {
    var toSave = []
    for (let i = 0; i < size; i++) {
        let row = []
        for (let j = 0; j < size; j++) {
            if (cells[i][j].wall) {
                row.push(1)
            } else {
                row.push(0)
            }
        }
        toSave.push(row)
    }
    levels.push({img:c.toDataURL(), data:toSave})    
}

function setMethod(method) {
    if (startSearching) return;
    SEARCH_METHOD = method
}

function importLevel() {
    clear()
    var level
    if (size == 20) {
        level = levels[1].data
    } else {
        level = levels[0].data
    }
    level = level.split(",")
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (level[i * size + j] == 1) {
                cells[i][j].wall = true
            } else {
                cells[i][j].wall = false
            }
        }
    }

}

function clear() {
    console.log("clearing");
    q = []
    found = false
    root = null;
    stack = []
    startSearching = false;
    hasEnd = false;
    hasStart = false;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            cells[i][j] = new Cell(i, j)
        }
    }
}
function mount() {
    cellSize = c.height / size
    for (let i = 0; i < size; i++) {
        let row = []
        for (let j = 0; j < size; j++) {
            row.push(new Cell(i, j))
        }
        cells.push(row)
    }
}


