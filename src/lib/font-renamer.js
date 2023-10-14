
import path from 'path'
import { promises as fs, createReadStream, createWriteStream } from 'fs'
import { exec } from 'child-process-promise'
import archiver from 'archiver'


function callFontnameScript(cmd) {
    return exec(cmd)
        .then(function (result) {
            var stderr = result.stderr
            if (stderr) {
                console.log('python stderr', stderr)
                return Promise.reject('FontTools-skriptet har feilet.')
            }
            var stdout = result.stdout
            var reg = /\n1 (.+)\n/
            var name = null
            if (reg.test(stdout)) {
                var result = reg.exec(stdout)
                name = result[1]
            }
            if (name !== null)
                return Promise.resolve(name)
        })
        .catch(function (err) {
            console.log('python err', err)
            return Promise.reject('FontTools-skriptet har feilet.')
        })
}

function zipFiles(files, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }})
    const out = createWriteStream(outPath)
    return new Promise((resolve, reject) => {
        archive
            .on('error', err => {
                console.log('archive feila', err)
                reject('Zipping av filene feilet.')
            })
            .pipe(out)
  
        for (var i = 0; i < files.length; i++) {
            const file1 = path.join(path.resolve(), files[i].path)
            let filename = files[i].originalname
            const zip = createReadStream(file1)
            zip.on('error', (err) => {
                console.log('zipp feila', err)
                reject('Zipping av filene feilet.')
            })
            archive.append(zip, { name: filename })
        }

        out.on('error', (err) => {
            console.log('write stream feila', err)
            reject('Feil i mappe- eller filstruktur.')
        })
        out.on('close', () => resolve())
        archive.finalize()
    })
}

const obj = { callFontnameScript, zipFiles }

export default obj