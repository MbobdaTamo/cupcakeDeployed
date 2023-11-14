const domain = 'cupcake.sassayer.com';
const app = express();
// redirect every single incoming request to https
app.use(function(req, res) {
    res.redirect('https://' + domain + req.originalUrl);
});
app.listen(3005);
